// global.d.ts
import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'back-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
