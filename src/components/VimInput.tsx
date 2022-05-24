/* eslint-disable @typescript-eslint/no-redeclare */
import Prism, { Token } from 'prismjs';
import 'prismjs/components/prism-markdown';
import React, { useMemo } from 'react';
import { createEditor, Descendant, Node, NodeEntry, Text } from 'slate';
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
import Leaf from './Leaf';
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

  const decorate = ([
    node,
    path,
  ]: NodeEntry<Node>): /*(node: Node, path: Path)*/ any[] => {
    const ranges: any[] = [];
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

    return ranges;
  };

  const renderElement = (props: RenderElementProps) => (
    <DefaultElement {...props} />
  );

  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  /*
  useEffect(() => {
    setInterval(() => console.log(editor.selection), 1000);
  });
  */

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => handleKeyDown(event, editor)}
      />
    </Slate>
  );
};

export default VimInput;
