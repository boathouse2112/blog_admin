import { BaseEditor } from 'slate';

type VimMode = 'normal' | 'insert';

export interface VimEditor extends BaseEditor {
  mode: VimMode;
  redecorateTrigger: number;
  lineCount: () => number;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveForwardWord: () => void;
  moveBackwardWord: () => void;
  moveEndWord: () => void;
  moveLineStart: () => void;
  moveLineEnd: () => void;
  newLineAbove: () => void;
  newLineBelow: () => void;
  insertMode: () => void;
  normalMode: () => void;
}
