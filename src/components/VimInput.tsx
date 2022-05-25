/* eslint-disable @typescript-eslint/no-redeclare */
import Prism, { Token } from 'prismjs';
import 'prismjs/components/prism-markdown';
import React, { useMemo } from 'react';
import {
  BasePoint,
  BaseSelection,
  createEditor,
  Descendant,
  Node,
  NodeEntry,
  Text,
} from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import { pointsEqual } from '../util/util';
import { handleKeyDown } from './key-handlers';
import Leaf from './Leaf';
import Line from './Line';
import { withVim } from './with-vim';

/**
 * Add up lengths of all the strings in the given token.
 */
const getLength = (token: string | Token): number => {
  if (typeof token === 'string') {
    return token.length;
  }

  const content = token.content;
  // Prism.TokenStream = string | Token | Array<string | Token>
  if (typeof token.content === 'string') {
    return token.content.length;
  } else if ((content as Token).type !== undefined) {
    return getLength(content as Token);
  } else {
    return (content as Array<string | Token>).reduce(
      (length: number, token: string | Token) => length + getLength(token),
      0
    );
  }
};

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

const VimInput = () => {
  const editor = useMemo(
    () => withVim(withHistory(withReact(createEditor()))),
    []
  );

  const decorate = ([node, path]: NodeEntry<Node>): any[] => {
    const ranges: any[] = [];

    // Syntax highlighting
    if (!Text.isText(node)) {
      return ranges;
    }
    const tokens = Prism.tokenize(node.text, Prism.languages['markdown']);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    const isSingleSelection = (selection: BaseSelection) => {
      const anchor = editor.selection?.anchor;
      const focus = editor.selection?.focus;
      return anchor && focus && pointsEqual(anchor, focus);
    };

    // Normal mode cursor
    if (editor.mode === 'normal' && isSingleSelection(editor.selection)) {
      const anchor = editor.selection?.anchor as BasePoint;
      ranges.push({
        cursor: true,
        anchor: anchor,
        focus: { ...anchor, offset: anchor.offset + 1 },
      });
    }

    return ranges;
  };

  const renderElement = (props: RenderElementProps) => <Line {...props} />;

  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  /*
  useEffect(() => {
    setInterval(() => console.log(editor.selection), 1000);
  });
  */

  return (
    <div className="mx-20 my-10 font-mono text-base leading-snug caret-transparent">
      <Slate editor={editor} value={initialValue}>
        <Editable
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => handleKeyDown(event, editor)}
        />
      </Slate>
    </div>
  );
};

export default VimInput;
