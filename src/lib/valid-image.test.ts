import { getFileExtension, isValidImage } from './valid-image';

describe('getFileExtension', () => {
  it.each`
    filePathOrUrl                      | expected
    ${'/path/to/image.jpg'}            | ${'.jpg'}
    ${'/another/file.png'}             | ${'.png'}
    ${'invalid-path'}                  | ${''}
    ${''}                              | ${''}
    ${'https://example.com/image.png'} | ${'.png'}
  `(
    'should return $expected for $filePathOrUrl',
    ({ filePathOrUrl, expected }) => {
      expect(getFileExtension(filePathOrUrl)).toBe(expected);
    },
  );
});

describe('isValidImage', () => {
  it.each`
    imageUrl                   | expected
    ${'/path/to/image.png'}    | ${true}
    ${'/path/to/photo.jpg'}    | ${true}
    ${'/another/pic.jpeg'}     | ${true}
    ${'/path/to/file.txt'}     | ${false}
    ${'/path/to/document.pdf'} | ${false}
  `('should return $expected for $imageUrl', ({ imageUrl, expected }) => {
    expect(isValidImage(imageUrl)).toBe(expected);
  });
});
