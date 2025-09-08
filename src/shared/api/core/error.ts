export function isError<T>(value: T | Error): value is Error {
  return (value as Error).message !== undefined;
}
