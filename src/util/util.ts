import assert from 'assert';
import { BasePoint, Editor, Element, Node, Point, Text } from 'slate';

const arraysEqual = <T>(a: Array<T>, b: Array<T>) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, index) => val === b[index]);

/**
 * Determine whether two Points are equal
 */
const pointsEqual = (a: BasePoint, b: BasePoint): boolean => {
  const pathsEqual = a.path.every((elem, idx) => elem === b.path[idx]);
  const offsetsEqual = a.offset === b.offset;
  return pathsEqual && offsetsEqual;
};

/**
 * Length of the line at the given index
 */
const lineLength = <T extends Editor>(editor: T, lineIdx: number) => {
  if (lineIdx >= editor.children.length) {
    throw new Error('Given index is larger than the number of lines');
  }
  const line = editor.children[lineIdx];

  assert(Element.isElement(line));
  return line.children.reduce(
    (length, textNode) => length + textNode.text.length,
    0
  );
};

/**
 * Gets the offset of a point, starting from the beginning of the line.
 */
const offsetInLine = <T extends Editor>(editor: T, point: Point) => {
  const { path, offset } = point;
  assert(path.length === 2); // The point should be a Text node child of a single parent

  const originalNodeIdx = path[1];

  // Sum up the number characters in the previous text nodes
  let previousCharacters = 0;
  for (let i = 0; i < originalNodeIdx; i++) {
    const textNodePath = [path[0], i];
    const textNode = Node.get(editor, textNodePath);
    assert(Text.isText(textNode));

    previousCharacters += Node.string(textNode).length;
  }

  return previousCharacters + offset;
};

/**
 * Gets the point at a line offset.
 */
const pointAtLineOffset = <T extends Editor>(
  editor: T,
  lineIdx: number,
  lineOffset: number
): BasePoint => {
  const line = Node.get(editor, [lineIdx]);
  assert(Element.isElement(line));

  let offset = lineOffset;
  for (const [i, textNode] of line.children.entries()) {
    const length = Node.string(textNode).length;

    if (offset < length) {
      return { path: [lineIdx, i], offset: offset };
    } else {
      offset -= length;
    }
  }

  // If the target line is too short, return the last point in that line.
  assert(line.children.length > 0);
  const lastTextNodeIdx = line.children.length - 1;
  const lastTextNodeLength = Node.string(line.children[lastTextNodeIdx]).length;
  return {
    path: [lineIdx, lastTextNodeIdx],
    offset: lastTextNodeLength,
  };
};

export {
  arraysEqual,
  pointsEqual,
  lineLength,
  offsetInLine,
  pointAtLineOffset,
};
