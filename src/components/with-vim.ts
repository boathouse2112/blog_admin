import { Editor, Transforms } from 'slate';
import { lineLength, offsetInLine, pointAtLineOffset } from '../util/util';
import { LineElement } from './types';
import { VimEditor } from './vim-editor';

const withVim = <T extends Editor>(editor: T): T & VimEditor => {
  const e = editor as T & VimEditor;

  e.mode = 'normal';

  e.lineCount = () => e.children.length;

  e.moveLeft = () => {
    const anchor = e.selection?.anchor;

    if (anchor === undefined) {
      throw new Error('Anchor undefined.');
    }

    // Don't move left if the start of cursor is at the start of the line.
    if (offsetInLine(e, anchor) !== 0) {
      Transforms.move(e, { distance: 1, reverse: true });
    }
  };

  e.moveRight = () => {
    const focus = e.selection?.focus;

    if (focus === undefined) {
      throw new Error('Focus undefined.');
    }

    // Don't move right if the end of the cursor is at the end of the line.
    if (offsetInLine(e, focus) !== lineLength(editor, focus.path[0])) {
      Transforms.move(e, { distance: 1 });
    }
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

  e.moveForwardWord = () => {
    Transforms.move(e, { unit: 'word' });
    Transforms.move(editor, { distance: 1 });
  };

  e.moveBackwardWord = () => {
    Transforms.move(e, { unit: 'word', reverse: true });
  };

  e.moveEndWord = () => {
    Transforms.move(e, { unit: 'word' });
  };

  e.newLineAbove = () => {
    const currentPoint = e.selection?.anchor;
    if (currentPoint !== undefined) {
      const { path } = currentPoint;
      const lineBelowLocation = [path[0]];
      const lineNode: LineElement = { type: 'line', children: [{ text: '' }] };
      Transforms.insertNodes(e, lineNode, { at: lineBelowLocation });
    }
  };

  e.newLineBelow = () => {
    const currentPoint = e.selection?.anchor;
    if (currentPoint !== undefined) {
      const { path } = currentPoint;
      const lineBelowLocation = [path[0] + 1];
      const lineNode: LineElement = { type: 'line', children: [{ text: '' }] };
      Transforms.insertNodes(e, lineNode, { at: lineBelowLocation });
    }
  };

  e.insertMode = () => {
    e.mode = 'insert';
    // Trigger decoration function call
    // TODO: Is there a better way to trigger it?
    e.moveRight();
    e.moveLeft();
  };

  e.normalMode = () => {
    e.mode = 'normal';
    e.moveRight();
    e.moveLeft();
  };

  return e;
};

export { withVim };
