import React from 'react';
import { Editor } from 'slate';
import { VimEditor } from './vim-editor';

const handleNormalMode = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor & VimEditor
) => {
  const handleVanillaKeys = () => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        editor.moveLeft(); // Override movement to avoid wrapping around
        break;

      case 'ArrowDown':
        event.preventDefault();
        editor.moveDown();
        break;

      case 'ArrowUp':
        event.preventDefault();
        editor.moveUp();
        break;

      case 'ArrowRight':
        event.preventDefault();
        editor.moveRight();
        break;

      case 'h':
        event.preventDefault();
        editor.moveLeft();
        break;

      case 'j':
        event.preventDefault();
        editor.moveDown();
        break;

      case 'k':
        event.preventDefault();
        editor.moveUp();
        break;

      case 'l':
        event.preventDefault();
        editor.moveRight();
        break;

      case 'i':
        event.preventDefault();
        editor.insertMode();
        break;

      case 'a':
        event.preventDefault();
        editor.insertMode();
        editor.moveRight();
        break;

      case 'w':
        event.preventDefault();
        editor.moveForwardWord();
        break;

      case 'b':
        event.preventDefault();
        editor.moveBackwardWord();
        break;

      case 'e':
        event.preventDefault();
        editor.moveEndWord();
        break;

      case 'o':
        event.preventDefault();
        editor.newLineBelow();
        editor.moveDown();
        editor.mode = 'insert';
        break;

      case 'O':
        event.preventDefault();
        editor.newLineAbove();
        editor.moveUp();
        editor.mode = 'insert';
        break;

      case '0':
        event.preventDefault();
        editor.moveLineStart();
        break;

      case '$':
        event.preventDefault();
        editor.moveLineEnd();
        break;
    }
  };

  const handleControlKeys = () => {};

  if (event.ctrlKey) {
    handleControlKeys();
  } else if (!(event.ctrlKey || event.altKey || event.metaKey)) {
    handleVanillaKeys();
  }
};

const handleInsertMode = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor & VimEditor
) => {
  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      editor.normalMode();
      return;

    case 'ArrowLeft':
      event.preventDefault();
      editor.moveLeft(); // Override movement to avoid wrapping around
      break;

    case 'ArrowDown':
      event.preventDefault();
      editor.moveDown();
      break;

    case 'ArrowUp':
      event.preventDefault();
      editor.moveUp();
      break;

    case 'ArrowRight':
      event.preventDefault();
      editor.moveRight();
      break;
  }
};

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor & VimEditor
) => {
  switch (editor.mode) {
    case 'normal':
      handleNormalMode(event, editor);
      return;
    case 'insert':
      handleInsertMode(event, editor);
      return;
    default:
      throw Error('Non-exhaustive switch statement.');
  }
};

export { handleKeyDown };
