import { CommandProcessor, ReadSettings } from '../src/command-processor';

describe('Command processor should', () => {
    test('read given file and return requested line', async() => {
        const request: ReadSettings = {
            fileName: 'input_file.txt',
            lineNumber: 3
        };

        const processor = new CommandProcessor();
        expect(await processor.read(request)).toBe('lemon');
    });
});
