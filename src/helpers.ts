import fs from 'fs';
import crypto from 'crypto';

export const fileHash = (path: string) => {
  const stats = fs.statSync(path);
  const hash = crypto.createHash('sha256');

  hash.update(stats.size.toString());
  hash.update(stats.birthtimeMs.toString());
  hash.update(stats.mtimeMs.toString());
  hash.update(path);

  return hash.digest('hex');
};
