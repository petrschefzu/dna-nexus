import { Logger } from './logger';

export class NullLogger implements Logger {
  log(message: string) {
    // Do nothing
  }
}
