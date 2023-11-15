import './ShikiHighlighter.css';
import 'shiki/themes/css-variables.json';

import { ReactElement } from 'react';
import { getHighlighter as getShiki, Highlighter, renderToHtml } from 'shiki';

let singleton: Highlighter;

export async function loadHighlighter(): Promise<Highlighter> {
  if (singleton === undefined) {
    singleton = await getShiki({
      theme: 'css-variables',
    });
  }
  return singleton;
}

/**
 * ShikiHighlighter (server-only) to render code blocks with syntax highlighting.
 * This is part of the contented collection, using the same theme and engine as the contented bundler.
 */
export function ShikiHighlighter(props: {
  className?: string;
  code: string;
  language: string;
  highlighter: Highlighter;
}): ReactElement {
  const tokens = props.highlighter.codeToThemedTokens(props.code, props.language);
  const html = renderToHtml(tokens, {
    fg: props.highlighter.getForegroundColor(),
    bg: props.highlighter.getBackgroundColor(),
    elements: {
      pre({ className, style, children }) {
        return `<pre class="${className} css-variable ShikiHighlighter" style="${style}">${children}</pre>`;
      },
    },
  });

  return <div className={props.className} dangerouslySetInnerHTML={{ __html: html }} />;
}
