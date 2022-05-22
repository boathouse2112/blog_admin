import { assert } from 'console';
import { Context, Failure, failure, Parser, success } from './parserTypes';

/**
 * Match for a sequence of parsers
 */
const seq: <T>(parsers: Parser<T>[]) => Parser<T[]> =
  <T>(parsers: Parser<T>[]) =>
  (ctx: Context) => {
    const values: T[] = [];

    // Run through the parsers, passing the new context each time.
    // If one fails, return the failure.
    let currentCtx = ctx;
    for (const parser of parsers) {
      const res = parser(currentCtx);
      if (res.success) {
        values.push(res.value);
        currentCtx = res.ctx;
      } else {
        return res;
      }
    }

    return success(currentCtx, values);
  };

/**
 * Match a pair of parsers
 */
function pair<T, U>(first: Parser<T>, second: Parser<U>): Parser<[T, U]> {
  return (ctx: Context) => {
    const firstRes = first(ctx);
    if (firstRes.success) {
      const secondRes = second(firstRes.ctx);
      if (secondRes.success) {
        return success(secondRes.ctx, [firstRes.value, secondRes.value]);
      } else {
        return secondRes;
      }
    } else {
      return firstRes;
    }
  };
}

/**
 * Short-circuiting any.
 * Look for the first matching result.
 * Returns the failure that got furthest in the input string.
 * Precondition: @param parsers is non-empty.
 */
const any: <T>(parsers: Parser<T>[]) => Parser<T> =
  (parsers) => (ctx: Context) => {
    // Precondition: parsers is non-empty.
    assert(parsers.length > 0);

    let currentFailure: Failure | undefined;
    for (const parser of parsers) {
      const res = parser(ctx);
      if (res.success) {
        // Return the first success.
        return res;
      } else {
        // Update the current failure if it's undefined, or if this parser got further in the input.
        if (
          currentFailure === undefined ||
          res.ctx.index > currentFailure.ctx.index
        ) {
          currentFailure = res;
        }
      }
    }

    assert(currentFailure !== undefined); // True, since parsers is non-empty and we haven't returned.
    return currentFailure as Failure;
  };

/**
 * Match a parser, or succeed with undefined if not found. cannot fail
 */
const optional: <T>(parser: Parser<T>) => Parser<T | undefined> =
  (parser) => (ctx: Context) => {
    const res = parser(ctx);
    if (res.success) {
      return res;
    } else {
      return success(res.ctx, undefined);
    }
  };

/**
 * Look for 0 or more of something, until a parse fails.
 * Never fails, simply succeeds with an empty array.
 */
const many: <T>(parser: Parser<T>) => Parser<T[]> =
  <T>(parser: Parser<T>) =>
  (ctx: Context) => {
    let values: T[] = [];

    let currentCtx = ctx;
    while (true) {
      const res = parser(currentCtx);
      if (res.success) {
        values.push(res.value);
        currentCtx = res.ctx;
      } else {
        break;
      }
    }

    return success(currentCtx, values);
  };

/**
 * Look for a single string.
 */
const str: (match: string) => Parser<string> = (match) => (ctx: Context) => {
  const startIdx = ctx.index;
  const endIdx = startIdx + match.length;
  if (ctx.text.substring(startIdx, endIdx) === match) {
    return success({ ...ctx, index: endIdx }, match);
  } else {
    return failure(ctx, match);
  }
};

function map<T, U>(parser: Parser<T>, func: (value: T) => U): Parser<U> {
  return (ctx: Context) => {
    const res = parser(ctx);
    return res.success ? success(res.ctx, func(res.value)) : res;
  };
}

export { seq, pair, any, optional, many, str, map };
