declare module 'lodash.isequal' {
  const isEqual: (value: unknown, other: unknown) => boolean;
  export default isEqual;
}

declare module 'html-to-draftjs' {
  import { ContentBlock, DraftEntityMutability } from 'draft-js';
  export interface HtmlToDraftResult {
    contentBlocks: ContentBlock[];
    entityMap: Record<number, { type: string; mutability: DraftEntityMutability; data: Record<string, unknown> }>;
  }
  export default function htmlToDraft(html: string): HtmlToDraftResult;
}

declare module 'draftjs-to-html' {
  import { RawDraftContentState } from 'draft-js';
  export default function draftToHtml(contentState: RawDraftContentState): string;
}

declare module 'draft-js' {
  export interface RawDraftContentState {
    blocks: Array<{ text: string }>;
  }
  export class ContentState {
    static createFromBlockArray(blocks: any, entityMap?: any): ContentState;
  }
  export class EditorState {
    static createEmpty(): EditorState;
    static createWithContent(contentState: ContentState): EditorState;
    getCurrentContent(): ContentState;
  }
  export function convertToRaw(contentState: ContentState): RawDraftContentState;
}

declare module 'react-draft-wysiwyg' {
  import type { FC } from 'react';
  export interface EditorProps {
    editorState: any;
    onEditorStateChange(nextState: any): void;
    toolbarClassName?: string;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbar?: Record<string, unknown>;
  }
  export const Editor: FC<EditorProps>;
}

declare module 'react-input-autosize' {
  import type { FC } from 'react';
  interface AutosizeInputProps {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputClassName?: string;
    inputStyle?: Record<string, unknown>;
    placeholder?: string;
    name?: string;
    id?: string;
    autoFocus?: boolean;
    disabled?: boolean;
  }
  const AutosizeInput: FC<AutosizeInputProps>;
  export default AutosizeInput;
}

declare module 'circle-to-polygon' {
  type Coordinate = [number, number];
  interface CirclePolygon {
    coordinates: Coordinate[][][];
  }
  export default function circleToPolygon(
    center: Coordinate,
    radius: number,
    numberOfEdges: number,
    options?: Record<string, unknown>
  ): CirclePolygon;
}
