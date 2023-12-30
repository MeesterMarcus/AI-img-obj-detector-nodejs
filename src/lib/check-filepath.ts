/**
 * Use regex to determien if the url is local filepath or remote
 * @param url : string
 * @returns boolean
 */
export const isLocalFile = (url: string): boolean => {
  const localFilePattern = /^(file:\/\/\/|[A-Za-z]:\\|\/)/;
  return localFilePattern.test(url);
};
