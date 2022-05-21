/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import {
  DefaultElement,
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import { handleKeyDown } from './key-handlers';
import { withVim } from './with-vim';

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
