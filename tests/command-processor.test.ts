import { CommandProcessor, ReadSettings } from '../src/command-processor';
import { FileCacheManager } from '../src/file-cache.manager';
import { NullLogger } from '../src/null.logger';
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
    const logger = new NullLogger();
    const processor = new CommandProcessor(cache, logger);
    expect(await processor.read(request)).toBe('lemon');

    await cache.clear();
  });

  test('should cache given file and return requested line', async () => {
    const request: ReadSettings = {
      fileName: 'input_file_2.txt',
      lineNumber: 3,
    };

    const cache = new FileCacheManager(request.fileName);
    const logger = new NullLogger();
    const processor = new CommandProcessor(cache, logger);
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
    const logger = new NullLogger();
    const processor = new CommandProcessor(cache, logger);

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

  test('should init cache only once per file', async () => {
    const fileName = 'input_file_4.txt';

    const cache = new FileCacheManager(fileName);
    const logger = new NullLogger();
    const processor = new CommandProcessor(cache, logger);

    const spyOnLogger = jest.spyOn(logger, 'log');
    const spyOnCache = jest.spyOn(cache, 'init');

    await processor.read({ fileName, lineNumber: 3 });
    await processor.read({ fileName, lineNumber: 1 });
    await processor.read({ fileName, lineNumber: 0 });
    await processor.read({ fileName, lineNumber: 2 });

    expect(spyOnLogger).toHaveBeenCalledWith(
      `Writing index to ${fileName} done.`,
    );
    expect(spyOnLogger).toHaveBeenCalledTimes(1);
    expect(spyOnCache).toHaveBeenCalledTimes(1);

    await cache.clear();
  }, 10_000);
});
