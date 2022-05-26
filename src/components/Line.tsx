import React from 'react';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import styles from './line.module.css';

const Line = (props: RenderElementProps) => {
  const { attributes, element, children } = props;
  const editor = useSlate();

  const lineNumber = () => {
    return ReactEditor.findPath(editor, element);
  };

  return (
    <div
      {...attributes}
      style={{ ...(editor.mode === 'normal' && { caretColor: 'transparent' }) }}
    >
      {
        <div
          contentEditable={false}
          className={`inline-block ${styles['line-number']}`}
          data-content={lineNumber() + ' '}
        ></div>
      }
      {children}
    </div>
  );
};

export default Line;
