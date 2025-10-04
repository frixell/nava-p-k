import { Global, useTheme } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import type { AppTheme } from '../../styles/theme';

export const richTextClassNames = {
  toolbar: 'richtext__toolbar',
  editor: 'richtext__editor',
  blockType: 'richtext__block-type',
  fontSize: 'richtext__font-size',
  fontFamily: 'richtext__font-family'
} as const;

export const RichTextEditorStyles = ({ children }: PropsWithChildren) => {
  const theme = useTheme() as AppTheme;

  return (
    <>
      <Global
        styles={{
          [`.${richTextClassNames.toolbar}`]: {
            fontSize: '0.875rem',
            lineHeight: '1rem',
            padding: 0,
            margin: 0,
            marginTop: '-2rem',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexWrap: 'nowrap',
            gap: theme.app.spacing.xs
          },
          [`.${richTextClassNames.editor}`]: {
            fontSize: '0.875rem',
            lineHeight: '1rem',
            width: '100%',
            color: `var(--color-text-muted, ${theme.app.colors.text.muted})`,
            padding: `0 0 ${theme.app.spacing.lg} 0`,
            margin: 0,
            paddingRight: '0.625rem',
            overflow: 'hidden'
          },
          [`.${richTextClassNames.blockType}`]: {
            fontSize: '1.3rem',
            lineHeight: '1.6rem',
            margin: 0,
            marginLeft: '0.125rem'
          },
          [`.${richTextClassNames.fontSize}`]: {
            fontSize: '1.3rem',
            lineHeight: '1.6rem',
            margin: 0,
            marginLeft: '0.125rem',
            width: '2.5rem'
          },
          [`.${richTextClassNames.fontFamily}`]: {
            fontSize: '1.3rem',
            lineHeight: '1.6rem',
            margin: 0,
            marginLeft: '0.125rem',
            width: '7.5rem'
          }
        }}
      />
      {children}
    </>
  );
};

export const useRichTextEditorClassNames = () => richTextClassNames;
