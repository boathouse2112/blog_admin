/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';
import { BaseEditor, createEditor, Descendant } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import {
  DefaultElement,
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import { VimEditor } from './vim-editor';
import { withVim } from './with-vim';

type DefaultElement = {
  type: 'line';
  children: CustomText[];
};

type CodeElement = {
  type: 'code';
  children: CustomText[];
};

type FormattedText = {
  text: string;
  bold?: true;
};

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & VimEditor;
type CustomElement = DefaultElement | CodeElement;
type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'line',
    children: [{ text: 'This is editable plaintext.' }],
  },
  {
    type: 'line',
    children: [{ text: 'This is editable plaintext.' }],
  },
  {
    type: 'line',
    children: [{ text: 'This is editable plaintext.' }],
  },
  {
    type: 'line',
    children: [{ text: 'This is editable plaintext.' }],
  },
];

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  );
};

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: CustomEditor
) => {
  const handleVanillaKeys = () => {
    switch (event.key) {
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
    }
  };

  const handleControlKeys = () => {};

  if (event.ctrlKey) {
    handleControlKeys();
  } else if (
    !(event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
  ) {
    handleVanillaKeys();
  }
};

const VimInput = () => {
  const [editor] = useState(() =>
    withVim(withHistory(withReact(createEditor())))
  );

  const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };

  const renderLeaf = (props: RenderLeafProps) => {
    return <Leaf {...props} />;
  };

  useEffect(() => {
    setInterval(() => console.log(editor.selection), 1000);
  });

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => handleKeyDown(event, editor)}
      />
    </Slate>
  );
};

export default VimInput;
