/**
 * Get the file extension from a string (e.g., file path or URL).
 * @param filePathOrUrl - The string containing the file path, URL, or file name.
 * @returns The file extension (including the dot) or an empty string if not found.
 */
export const getFileExtension = (filePathOrUrl: string): string => {
  const fileExtensionMatch = filePathOrUrl.match(/(\.[^./\\]*)$/);
  return fileExtensionMatch && fileExtensionMatch.length > 0 ? fileExtensionMatch[0] : '';
};

export const isValidImage = (imageUrl: string): boolean => {
  const fileExtension = getFileExtension(imageUrl).toLowerCase();
  console.log(fileExtension);
  switch (fileExtension) {
    case '.png':
      return true;
    case '.jpg':
      return true;
    case '.jpeg':
      return true;
    default:
      false;
  }
  return false;
};
