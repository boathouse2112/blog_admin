import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { VimEditor } from './vim-editor';

type LineElement = {
  type: 'line';
  children: CustomText[];
};

type Text = {
  text: string;
};

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & VimEditor;
type CustomElement = LineElement;
type CustomText = Text;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type { LineElement, CustomEditor, CustomElement, CustomText };
