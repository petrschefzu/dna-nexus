import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { LineCacheManager } from './line-cache.manager';
import { Logger } from './logger';

export interface ReadSettings {
  fileName: string;
  lineNumber: number;
}

export class CommandProcessor {
  constructor(
    private readonly cache: LineCacheManager,
    private readonly logger: Logger,
  ) {}

  public async read(file: ReadSettings): Promise<string> {
    if (!this.cache.exists()) {
      await this.indexFile(file.fileName);
    }

    if (!this.cache.has(file.lineNumber)) {
      throw new Error(
        `Line ${file.lineNumber} not found in file ${file.fileName}.`,
      );
    }

    return this.cache.get(file.lineNumber);
  }

  public async indexFile(fileName: string) {
    const filePath = path.join(__dirname, 'files', fileName);
    /**
     * It is important to use streams when reading large files,
     * because it allows you to read the file in chunks, instead of loading the entire file into memory.
     **/
    const input = fs.createReadStream(filePath);

    // Readline is native to Node.js and is used to read files line by line.
    const rl = readline.createInterface({
      input,
      crlfDelay: Infinity,
    });

    let currentLine = 0;
    this.cache.init();
    for await (const line of rl) {
      this.cache.set(currentLine, line);
      currentLine++;
    }

    this.logger.log(`Writing index to ${fileName} done.`);
  }
}
