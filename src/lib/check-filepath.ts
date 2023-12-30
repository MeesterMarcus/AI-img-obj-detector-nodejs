export const isLocalFile = (url: string) => {
    // Check if the URL starts with "file://" or contains a Windows file path "C:\" or "D:\"
    const localFilePattern = /^(file:\/\/\/|[A-Za-z]:\\|\/)/;
    return localFilePattern.test(url);
}