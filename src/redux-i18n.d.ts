import 'redux-i18n';
import { ReactNode } from 'react';

declare module 'redux-i18n' {
    // Augment the I18nProps interface to include the 'children' prop
    export interface I18nProps { children?: ReactNode; }
}