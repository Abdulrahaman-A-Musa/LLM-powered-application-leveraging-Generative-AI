import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z"/>
    <path d="M15.5 15.5 18 18"/>
    <path d="M8.5 8.5 6 6"/>
    <path d="M12 8.5V10"/>
    <path d="M8.5 12H10"/>
    <path d="M12 15.5V14"/>
    <path d="M15.5 12H14"/>
  </svg>
);