/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEditor, Descendant } from 'slate';
import { lineLength, offsetInLine, pointAtLineOffset } from './util';

const textNode = (text: string) => ({ text });

describe('lineLength', () => {
  it('sums the length of all text nodes', () => {
    // arrange
    const initialValue: Descendant[] = [
      {
        type: 'line',
        children: [
          textNode('plain'),
          textNode('text'),
          textNode('this is the target node.'),
        ],
      },
    ];
    const lineIdx = 0;

    const editor = createEditor();
    editor.children = initialValue;

    // act
    const length = lineLength(editor, lineIdx);

    // assert
    expect(length).toBe(33);
  });
});

describe('offsetInLine', () => {
  it("gives the original offset if there's only 1 text node", () => {
    // arrange
    const initialValue: Descendant[] = [
      {
        type: 'line',
        children: [{ text: 'This is editable plaintext.' }],
      },
    ];

    const originalOffset = 5;
    const point = { path: [0, 0], offset: originalOffset };

    const editor = createEditor();
    editor.children = initialValue;
    editor.selection = {
      anchor: point,
      focus: point,
    };

    // act
    const offset = offsetInLine(editor, point);

    // assert
    expect(offset).toEqual(originalOffset);
  });

  it('Adds the length of previous nodes if they exist', () => {
    // arrange
    const initialValue: Descendant[] = [
      {
        type: 'line',
        children: [
          textNode('plain'),
          textNode('text'),
          textNode('this is the target node.'),
        ],
      },
    ];

    const originalOffset = 5;
    const point = { path: [0, 2], offset: originalOffset };

    const editor = createEditor();
    editor.children = initialValue;
    editor.selection = {
      anchor: point,
      focus: point,
    };

    // act
    const offset = offsetInLine(editor, point);

    // assert
    const expectedOffset = 'plain'.length + 'text'.length + originalOffset;
    expect(offset).toEqual(expectedOffset);
  });
});

describe('pointAtLineOffset', () => {
  it("gives the original offset if there's only 1 text node", () => {
    // arrange
    const initialValue: Descendant[] = [
      {
        type: 'line',
        children: [textNode('plain text')],
      },
    ];

    const editor = createEditor();
    editor.children = initialValue;

    // act
    const originalOffset = 5;
    const point = pointAtLineOffset(editor, 0, originalOffset);

    // assert
    expect(point).toEqual({ path: [0, 0], offset: originalOffset });
  });

  it('correctly subtracts the lengths of text nodes smaller than the offset', () => {
    // arrange

    const initialValue: Descendant[] = [
      {
        type: 'line',
        children: [
          textNode('plain'),
          textNode('text'),
          textNode('this is the target node.'),
        ],
      },
    ];

    const editor = createEditor();
    editor.children = initialValue;

    // act
    const originalOffset = 12;
    const offset = pointAtLineOffset(editor, 0, originalOffset);

    // assert
    const expectedOffset = 3;
    expect(offset).toEqual({ path: [0, 2], offset: expectedOffset });
  });
});
