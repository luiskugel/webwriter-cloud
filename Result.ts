export abstract class ResultType<T> {
  abstract isOk(): boolean;
  abstract isErr(): boolean;
  abstract unwrap(): T;
  abstract unwrapErr(): Error;
  abstract unwrapOr(default_value: T): T;
  abstract unwrapOrElse(fn: () => T): T;
}

export class Ok<T> extends ResultType<T> {
  constructor(private value: T) {
    super();
  }
  isOk(): boolean {
    return true;
  }
  isErr(): boolean {
    return false;
  }
  unwrap(): T {
    return this.value;
  }
  unwrapErr(): Error {
    return new Error("Result is Ok");
  }
  unwrapOr(_: T): T {
    return this.value;
  }
  unwrapOrElse(fn: () => T): T {
    return this.value;
  }
}

export class Err<T> extends ResultType<T> {
  constructor(private error: Error) {
    super();
  }
  isOk(): boolean {
    return false;
  }
  isErr(): boolean {
    return true;
  }
  unwrap(): T {
    throw this.error;
  }
  unwrapErr(): Error {
    return this.error;
  }
  unwrapOr(default_value: T): T {
    return default_value;
  }
  unwrapOrElse(fn: () => T): T {
    return fn();
  }
}

export const Result = { Ok, Err };

export async function intoResult<T>(
  func: () => Promise<T | undefined>,
  undefinedError?: Error
): Promise<ResultType<T>> {
  try {
    const res = await func();
    if (res === undefined) {
      if (undefinedError === undefined)
        return new Result.Err(new Error("Result is undefined"));
      return new Result.Err(undefinedError);
    }
    return new Result.Ok(res);
  } catch (error) {
    return new Result.Err(error);
  }
}
