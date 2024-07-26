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

    await cache.clear();
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

    await cache.clear();
  });

  test('should benefit from cached file while called multiple times', async () => {
    const lastLine: ReadSettings = {
      fileName: 'input_file_3.txt',
      lineNumber: 39998,
    };

    const oneBeforeTheLastLine: ReadSettings = {
      fileName: 'input_file_3.txt',
      lineNumber: 39997,
    };

    const cache = new FileCacheManager(lastLine.fileName);
    const processor = new CommandProcessor(cache);

    const timer_0 = Date.now();
    expect(await processor.read(lastLine)).toBe(
      'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
    );
    const timer_1 = Date.now();
    expect(await processor.read(oneBeforeTheLastLine)).toBe(
      'Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.',
    );
    const timer_2 = Date.now();

    const firstRun = timer_1 - timer_0;
    const secondRun = timer_2 - timer_1;

    expect(firstRun).not.toBeCloseTo(0);
    expect(secondRun).toBeCloseTo(0);

    await cache.clear();
  }, 10_000);
});
