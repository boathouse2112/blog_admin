import { any, pair, seq, str } from '../combinator';
import { Context, Failure, Success } from '../parserTypes';

// Create a context that starts at the beginning of the document.
const startCtx = (text: string): Context => ({ text, index: 0 });

describe('str', () => {
  it('parses a string', () => {
    const parser = str('example');

    const res = parser(startCtx('example')) as Success<string>;

    expect(res.success).toBe(true);
    expect(res.value).toBe('example');
  });

  it('moves the context index', () => {
    const parser = str('ex');

    const res = parser(startCtx('example')) as Success<string>;

    expect(res.success).toBe(true);
    expect(res.value).toBe('ex');
    expect(res.ctx.index).toBe(2);
  });

  it("fails if the string doesn't start with the target value", () => {
    const parser = str('ample');

    const res = parser(startCtx('example'));

    expect(res.success).toBe(false);
  });
});

describe('seq', () => {
  it('combines multiple parsers', () => {
    const first = str('ex');
    const second = str('am');
    const third = str('pl');
    const parser = seq([first, second, third]);

    const res = parser(startCtx('example')) as Success<string[]>;

    expect(res.success).toBe(true);
    expect(res.value).toStrictEqual(['ex', 'am', 'pl']);
    expect(res.ctx.index).toBe(6);
  });

  it('fails if one argument fails', () => {
    const first = str('ex');
    const second = str('aa');
    const fourth = str('mple');
    const third = str('ample');
    const parser = seq([first, second, third, fourth]);

    const res = parser(startCtx('example'));

    expect(res.success).toBe(false);
  });
});

describe('pair', () => {
  it('combines two parsers', () => {
    const first = str('ex');
    const second = str('am');
    const parser = pair(first, second);

    const res = parser(startCtx('example')) as Success<[string, string]>;

    expect(res.success).toBe(true);
    expect(res.value).toStrictEqual(['ex', 'am']);
    expect(res.ctx.index).toBe(4);
  });

  it('fails if one argument fails', () => {
    const first = str('ex');
    const second = str('aa');
    const parser = pair(first, second);

    const res = parser(startCtx('example'));

    expect(res.success).toBe(false);
  });
});

describe('any', () => {
  it('succeeds if any argument succeeds', () => {
    const first = str('qw');
    const second = str('er');
    const third = str('ty');
    const fourth = str('ex');
    const parser = any([first, second, third, fourth]);

    const res = parser(startCtx('example')) as Success<string>;

    expect(res.success).toBe(true);
    expect(res.value).toBe('ex');
    expect(res.ctx.index).toBe(2);
  });

  it('returns the failure that advanced the farthest', () => {
    const first = str('ex');
    const second = str('am');
    const third = str('pl');
    const fourth = str('e');
    const bad = str('x');

    const firstSeq = seq([first, second, bad]);
    const secondSeq = seq([first, second, third, fourth, bad]);
    const thirdSeq = seq([first, second, third, bad]);
    const parser = any([firstSeq, secondSeq, thirdSeq]);

    const res = parser(startCtx('example')) as Failure;

    expect(res.success).toBe(false);
    expect(res.expected).toBe('x');
    expect(res.ctx).toStrictEqual({ text: 'example', index: 7 });
  });
});
