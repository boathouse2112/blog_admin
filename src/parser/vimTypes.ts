type Rule = {
  operator: Operator;
  motion: Motion;
};

type Operator = {
  repetition?: number;
  op: OpCode;
};

const opCodes = ['d', 'y', 'c', '>', '<'] as const;
type OpCode = typeof opCodes[number];

type Motion = {
  repetition?: number;
  motion: string;
};

const motionCodes = [
  'h',
  'j',
  'k',
  'l',
  'w',
  'b',
  'e',
  '0',
  '^',
  '$',
  'gg',
  'G',
] as const;
type MotionCode = typeof motionCodes[number];

type Repetition = number;

export { opCodes, motionCodes };
export type { Rule, Operator, OpCode, Motion, MotionCode, Repetition };
