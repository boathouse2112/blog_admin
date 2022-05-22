import { any, many, map, optional, pair, seq, str } from './combinator';
import { Context, Parser, Result, success } from './parserTypes';
import {
  Motion,
  MotionCode,
  motionCodes,
  OpCode,
  opCodes,
  Operator,
  Repetition,
  Rule,
} from './vimTypes';

const digitParsers = Array.from({ length: 10 }, (_, i) => i).map((n) =>
  str(n.toString())
);

const nonZeroDigitParsers = digitParsers.slice(1);

const digit: Parser<string> = any(digitParsers);

const nonZeroDigit: Parser<string> = any(nonZeroDigitParsers);

/**
 * Look for a repetition, matching [1-9][0-9]*
 */
const repetition: Parser<Repetition> = (ctx: Context) => {
  const digitsParser = map(
    seq<string | string[]>([nonZeroDigit, many(digit)]),
    (arr: (string | string[])[]) => arr.flat()
  );
  const res = digitsParser(ctx);
  if (res.success) {
    const num = parseInt(res.value.join(''), 10);
    return success(res.ctx, num);
  } else {
    return res;
  }
};

const opCode: Parser<OpCode> = any(opCodes.map(str)) as Parser<OpCode>;

const operator: Parser<Operator> = map(
  pair(optional(repetition), opCode),
  ([rep, op]) => ({
    repetition: rep,
    op: op,
  })
);

const motionCode: Parser<MotionCode> = any(
  motionCodes.map(str)
) as Parser<MotionCode>;

const motion: Parser<Motion> = map(
  pair(optional(repetition), motionCode),
  ([rep, mCode]) => ({ repetition: rep, motion: mCode })
);

const rule: Parser<Rule> = map(
  pair(operator, motion),
  ([operator, motion]) => ({ operator, motion })
);

const parseRule = (text: string): Result<Rule> => {
  const startingCtx = { text, index: 0 };
  return rule(startingCtx);
};

export { parseRule };
