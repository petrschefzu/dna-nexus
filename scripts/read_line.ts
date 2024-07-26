import { CommandProcessor } from '../src/command-processor';
import { ConsoleLogger } from '../src/console.logger';
import { FileCacheManager } from '../src/file-cache.manager';

// Check if the correct number of arguments are passed
if (process.argv.length !== 4) {
  console.error(
    'Please provide exactly two parameters, name of file from ./files directory and number of line to read',
  );
  process.exit(1);
}

// Extract the parameters
const fileName = process.argv[2];
const lineNumber = process.argv[3];

if (!CommandProcessor.fileExists(fileName)) {
  console.error(`File ${fileName} not found.`);
  process.exit(1);
}

// Check if the line number is a number, we could also check if it is a positive number, integer, etc. but for simplicity we will just check if it is a number
if (isNaN(parseInt(lineNumber))) {
  console.error('Line number must be a number.');
  process.exit(1);
}

async function main() {
  try {
    const logger = new ConsoleLogger();
    const cache = new FileCacheManager(fileName, 'cmd-cache');

    const processor = new CommandProcessor(cache, logger);
    const line = await processor.read({
      fileName,
      lineNumber: parseInt(lineNumber),
    });

    console.log(line);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

main();
