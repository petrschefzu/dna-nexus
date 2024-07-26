/**
 * This interface allows as to implement different caching strategies in the future.
 */
export interface LineCacheManager {
  exists(): boolean;
  init(): void;
  set(lineNumber: number, value: string): void;
  has(lineNumber: number): boolean;
  get(lineNumber: number): string;
}
