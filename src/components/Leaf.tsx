/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { RenderLeafProps } from 'slate-react';

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf: leafProp } = props;
  const leaf = leafProp as any;
  console.log('leaf: ', leaf);
  return (
    <span
      {...attributes}
      css={css`
        font-family: monospace;
        background-color: white;
        color: black;
      `}
    >
      {children}
    </span>
  );
};

export default Leaf;
