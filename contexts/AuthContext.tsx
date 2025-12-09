import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';

// Declare global google and gapi objects from the scripts loaded in index.html
declare const google: any;
declare const gapi: any;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';

interface AuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  isInitialized: boolean;
  isGoogleDriveConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);
  const [isGsiInitialized, setIsGsiInitialized] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  const isGoogleDriveConfigured = !!GOOGLE_CLIENT_ID;

  useEffect(() => {
    const handleGapiLoad = () => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          });
          setIsGapiInitialized(true);
        } catch (error) {
          console.error("Error initializing GAPI client:", error);
        }
      });
    };

    const gapiScript = document.getElementById('gapi-script');
    if (gapiScript) {
      gapiScript.onload = handleGapiLoad;
      // If script is already loaded
      if (typeof gapi !== 'undefined' && typeof gapi.load === 'function') {
        handleGapiLoad();
      }
    }
  }, []);

  useEffect(() => {
    if (!isGoogleDriveConfigured) {
      console.warn("GOOGLE_CLIENT_ID environment variable not set. Google Drive functionality will be disabled.");
      setIsGsiInitialized(true); // Mark as initialized to not block UI
      return;
    }

    const handleGsiLoad = () => {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error('Google Sign-In Error:', tokenResponse.error);
              setIsSignedIn(false);
              return;
            }
            if (tokenResponse.access_token) {
              gapi.client.setToken({ access_token: tokenResponse.access_token });
              setIsSignedIn(true);
            }
          },
        });
        setTokenClient(client);
        setIsGsiInitialized(true);
      } catch (error) {
          console.error("Error initializing GSI client:", error);
      }
    };

    const gsiScript = document.getElementById('gsi-script');
    if (gsiScript) {
      gsiScript.onload = handleGsiLoad;
       // If script is already loaded
      if (typeof google !== 'undefined' && typeof google.accounts !== 'undefined') {
        handleGsiLoad();
      }
    }
  }, [isGoogleDriveConfigured]);

  const signIn = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: '' });
    } else {
      console.error("Google Auth client not initialized.");
    }
  }, [tokenClient]);

  const signOut = useCallback(() => {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null);
        setIsSignedIn(false);
      });
    }
  }, []);

  const isInitialized = isGapiInitialized && isGsiInitialized;

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, isInitialized, isGoogleDriveConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};