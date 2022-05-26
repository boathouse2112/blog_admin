import { RenderLeafProps } from 'slate-react';
import styles from './leaf.module.css';

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf: leafProp } = props;
  const leaf = leafProp as any;
  return (
    <span
      {...attributes}
      className={`
        ${leaf.cursor && styles['normal-mode-cursor']}
        ${leaf.title && styles.title}
        ${leaf.text === '' && styles['empty-space']}
      `}
    >
      {children}
    </span>
  );
};

export default Leaf;
