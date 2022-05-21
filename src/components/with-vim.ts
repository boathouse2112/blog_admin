import { Editor, Transforms } from 'slate';
import { offsetInLine, pointAtLineOffset } from '../util/util';
import { VimEditor } from './vim-editor';

const withVim = <T extends Editor>(editor: T): T & VimEditor => {
  const e = editor as T & VimEditor;

  e.lineCount = () => e.children.length;

  e.moveLeft = () => {
    Transforms.move(e, { distance: 1, reverse: true });
  };

  e.moveRight = () => {
    Transforms.move(e, { distance: 1 });
  };

  e.moveUp = () => {
    const currentPoint = e.selection?.anchor;
    if (currentPoint !== undefined) {
      const { path } = currentPoint;

      const lineOffset = offsetInLine(e, currentPoint);
      const currentLineIdx = path[0];
      const aboveLineIdx = Math.max(0, currentLineIdx - 1);

      const pointAbove = pointAtLineOffset(e, aboveLineIdx, lineOffset);

      Transforms.select(e, pointAbove);
    }
  };

  e.moveDown = () => {
    const currentPoint = e.selection?.anchor;
    if (currentPoint !== undefined) {
      const { path } = currentPoint;

      const lineOffset = offsetInLine(e, currentPoint);
      const currentLineIdx = path[0];
      const belowLineIdx = Math.min(currentLineIdx + 1, e.lineCount() - 1);

      const pointAbove = pointAtLineOffset(e, belowLineIdx, lineOffset);

      Transforms.select(e, pointAbove);
    }
  };

  return e;
};

export { withVim };
