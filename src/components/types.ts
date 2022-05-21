import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { VimEditor } from './vim-editor';

type LineElement = {
  type: 'line';
  children: CustomText[];
};

type CodeElement = {
  type: 'code';
  children: CustomText[];
};

type FormattedText = {
  text: string;
  bold?: true;
};

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & VimEditor;
type CustomElement = LineElement | CodeElement;
type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type {
  LineElement,
  CodeElement,
  FormattedText,
  CustomEditor,
  CustomElement,
  CustomText,
};
