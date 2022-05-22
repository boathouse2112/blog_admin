// Every parsing function has this signature.
type Parser<T> = (ctx: Context) => Result<T>;

type Context = {
  text: string;
  index: number;
};

type Result<T> = Success<T> | Failure;

// On success, return a value, and an updated context with a new position.
type Success<T> = {
  success: true;
  value: T;
  ctx: Context;
};

// Give some information on failure.
type Failure = {
  success: false;
  expected: string;
  ctx: Context;
};

// Result builders
const success = <T>(ctx: Context, value: T): Success<T> => ({
  success: true,
  value,
  ctx,
});

const failure = (ctx: Context, expected: string): Failure => ({
  success: false,
  expected,
  ctx,
});

export type { Parser, Context, Result, Success, Failure };
export { success, failure };
