import { isLocalFile } from "./check-filepath";

describe('isLocalFile', () => {
  it.each`
    url                                             | expected
    ${'C:\\Users\\Username\\Desktop\\image.jpg'}    | ${true}  
    ${'/home/username/images/image.jpg'}            | ${true}  
    ${'http://example.com/image.jpg'}               | ${false}
    ${'https://example.com/image.jpg'}              | ${false} 
    ${'invalid-url'}                                | ${false} 
  `('should return $expected for "$url"', ({ url, expected }) => {
    expect(isLocalFile(url)).toBe(expected);
  });
});
