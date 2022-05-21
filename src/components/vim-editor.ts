import { BaseEditor } from 'slate';

type VimMode = 'normal' | 'insert';

export interface VimEditor extends BaseEditor {
  mode: VimMode;
  lineCount: () => number;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveForwardWord: () => void;
  moveBackwardWord: () => void;
  moveEndWord: () => void;
  newLineAbove: () => void;
  newLineBelow: () => void;
}
