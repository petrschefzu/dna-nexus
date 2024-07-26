import { CommandProcessor, ReadProps } from '../src/command-processor';

describe('Command processor should', () => {
    test('read given file and return requested line', async() => {
        const request: ReadProps = {
            fileName: 'input_file.txt',
            lineNumber: 2
        };

        const processor = new CommandProcessor();
        expect(await processor.read(request)).toBe('lemon');
    });
});
