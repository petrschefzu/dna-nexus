import fs, { promises } from 'fs';
import path from 'path';
import { LineCacheManager } from './line-cache.manager';
import { fileHash } from './helpers';

/**
 * Compared to FileReader,
 * we don't need to work with streams here, so we can use the synchronous version of the file system module.
 */
export class FileCacheManager implements LineCacheManager {
  private readonly cacheDir: string;

  constructor(fileName: string) {
    const filePath = path.join(__dirname, 'files', fileName);
    this.cacheDir = path.join(__dirname, 'cache', fileHash(filePath));
  }

  init(): void {
    if (!this.exists()) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getFilePath(line: number): string {
    return path.join(this.cacheDir, `${line}.txt`);
  }

  exists(): boolean {
    return fs.existsSync(this.cacheDir);
  }

  set(line: number, value: string): void {
    const filePath = this.getFilePath(line);

    fs.writeFileSync(filePath, value, 'utf8');
  }

  has(line: number): boolean {
    const filePath = this.getFilePath(line);

    return fs.existsSync(filePath);
  }

  get(line: number): string {
    const filePath = this.getFilePath(line);

    return fs.readFileSync(filePath, 'utf8');
  }

  async clear(): Promise<void> {
    const files = await promises.readdir(this.cacheDir);
    await Promise.all(
      files.map((file) => {
        return promises.unlink(path.join(this.cacheDir, file));
      }),
    );

    await promises.rmdir(this.cacheDir);
  }

  // Other methods omitted for brevity
}
