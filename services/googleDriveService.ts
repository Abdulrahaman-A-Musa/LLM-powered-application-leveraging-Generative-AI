declare const gapi: any;

export const extractFolderIdFromUrl = (url: string): string | null => {
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const getFileContent = async (file: { id: string; name: string; mimeType: string }): Promise<string> => {
  try {
    let content = '';
    if (file.mimeType === 'application/vnd.google-apps.document') {
      const response = await gapi.client.drive.files.export({
        fileId: file.id,
        mimeType: 'text/plain',
      });
      content = response.body;
    } else if (file.mimeType.startsWith('text/')) {
      const response = await gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media',
      });
      content = response.body;
    } else {
      // Silently ignore unsupported file types.
      return '';
    }
    return `\n\n--- START OF FILE: ${file.name} ---\n\n${content}\n\n--- END OF FILE: ${file.name} ---\n\n`;
  } catch (error) {
    console.error(`Failed to fetch content for file ${file.name}:`, error);
    return `\n\n--- ERROR FETCHING FILE: ${file.name} ---\n\n`;
  }
};

export const fetchDriveFolderContents = async (folderId: string): Promise<string> => {
  if (!gapi?.client?.drive) {
    throw new Error('Google Drive API client is not initialized.');
  }

  const response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.document' or mimeType contains 'text/') and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 100, // Fetch up to 100 files
  });

  const files = response.result.files;
  if (!files || files.length === 0) {
    throw new Error("No compatible files (.txt, .md, Google Docs) found in this folder. Please check folder contents and permissions.");
  }

  const contentPromises = files.map(getFileContent);
  const contents = await Promise.all(contentPromises);

  return contents.join('');
};