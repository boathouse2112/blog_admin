import React from 'react';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';

const Line = (props: RenderElementProps) => {
  const { attributes, element, children } = props;
  const editor = useSlate();

  const lineNumber = () => {
    return ReactEditor.findPath(editor, element);
  };

  return (
    <div {...attributes}>
      {<span contentEditable={false}>{lineNumber()} </span>}
      {children}
    </div>
  );
};

export default Line;
