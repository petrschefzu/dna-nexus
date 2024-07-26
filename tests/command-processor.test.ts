import { CommandProcessor, ReadSettings } from '../src/command-processor';
import { FileCacheManager } from '../src/file-cache.manager';
/**
 * To simplify test isolation, we are using a different file for each test case.
 *
 * When building production application, we would use a different, for example generated, file for each test case.
 */
describe('Command processor should', () => {
  test('read given file and return requested line', async () => {
    const request: ReadSettings = {
      fileName: 'input_file.txt',
      lineNumber: 3,
    };

    const cache = new FileCacheManager(request.fileName);
    const processor = new CommandProcessor(cache);
    expect(await processor.read(request)).toBe('lemon');

    cache.clear();
  });

  test('should cache given file and return requested line', async () => {
    const request: ReadSettings = {
      fileName: 'input_file_2.txt',
      lineNumber: 3,
    };

    const cache = new FileCacheManager(request.fileName);
    const processor = new CommandProcessor(cache);
    expect(cache.exists()).toBe(false);
    expect(await processor.read(request)).toBe('lemon');
    expect(cache.exists()).toBe(true);
    expect(cache.get(request.lineNumber)).toBe('lemon');

    cache.clear();
  });

  test.skip('should benefit from cached file while called multiple times', async () => {
    const request: ReadSettings = {
      fileName: 'input_file_3.txt',
      lineNumber: 3,
    };

    const cache = new FileCacheManager(request.fileName);
    const processor = new CommandProcessor(cache);
    expect(await processor.read(request)).toBe('lemon');
  });
});
