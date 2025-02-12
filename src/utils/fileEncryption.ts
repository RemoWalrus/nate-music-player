
// We'll use a simple base64 encoding combined with URL-safe characters
export const encryptFileName = (fileName: string): string => {
  // First, encode to base64
  const base64 = btoa(fileName);
  // Replace URL-unsafe characters
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const decryptFileName = (encryptedName: string): string => {
  // Replace URL-safe characters back
  const base64 = encryptedName
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add back padding if needed
  const pad = base64.length % 4;
  const paddedBase64 = pad 
    ? base64 + '='.repeat(4 - pad) 
    : base64;
  
  return atob(paddedBase64);
};
