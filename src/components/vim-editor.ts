import { BaseEditor } from 'slate';

export interface VimEditor extends BaseEditor {
  lineCount: () => number;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
}
