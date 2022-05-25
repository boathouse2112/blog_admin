import { RenderLeafProps } from 'slate-react';

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf: leafProp } = props;
  const leaf = leafProp as any;
  console.log('leaf: ', leaf);
  return (
    <span
      {...attributes}
      style={{
        backgroundColor: 'white',
        color: 'black',
        ...(leaf.title && { color: '#389edb' }),
      }}
    >
      {children}
    </span>
  );
};

export default Leaf;
