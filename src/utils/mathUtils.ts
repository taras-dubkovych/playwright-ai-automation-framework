export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
