import { RenderLeafProps } from 'slate-react';
import styles from './leaf.module.css';

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf: leafProp } = props;
  const leaf = leafProp as any;
  console.log('leaf: ', leaf);
  if (leaf.cursor) console.log('CURSOR!');
  return (
    <span
      {...attributes}
      className={`
        ${leaf.cursor && styles['normal-mode-cursor']}
        ${leaf.title && styles['normal-mode-cursor']}
      `}
    >
      {children}
    </span>
  );
};

export default Leaf;
