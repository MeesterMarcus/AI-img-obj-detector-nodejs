import { ImaggaResponse } from '../models/imagga';
import { extractHighConfidenceTags } from './extract-tags';

describe('extractHighConfidenceTags', () => {
  const testData = [
    {
      response: {
        result: {
          tags: [
            { tag: { en: 'cat' }, confidence: 80 },
            { tag: { en: 'dog' }, confidence: 90 },
            { tag: { en: 'tree' }, confidence: 60 },
          ],
        },
      },
      expected: ['cat', 'dog'],
    },
    {
      response: {
        result: {
          tags: [
            { tag: { en: 'car' }, confidence: 70 },
            { tag: { en: 'bike' }, confidence: 65 },
            { tag: { en: 'bus' }, confidence: 80 },
          ],
        },
      },
      expected: ['bus'],
    },
    {
      response: {
        result: {
          tags: [
            { tag: { en: 'apple' }, confidence: 75 },
            { tag: { en: 'banana' }, confidence: 74 },
            { tag: { en: 'orange' }, confidence: 72 },
          ],
        },
      },
      expected: ['apple'],
    },
  ];

  it.each(testData)('should retrieve tags with confidence above 75 for %p', ({ response, expected }) => {
    const result = extractHighConfidenceTags(response as ImaggaResponse);
    console.log(result);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
