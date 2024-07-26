import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface ReadSettings {
  fileName: string;
  lineNumber: number;
}

export class CommandProcessor {
  public async read(file: ReadSettings): Promise<string> {
    const filePath = path.join(__dirname, 'files', file.fileName);
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
    for await (const line of rl) {
      if (currentLine === file.lineNumber) {
        return line;
      }
      currentLine++;
    }

    throw new Error(
      `Line ${file.lineNumber} not found in file ${file.fileName}`,
    );
  }
}
