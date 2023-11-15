import { getHighlighter, Highlighter, renderToHtml } from 'shiki';
import CssVariables from 'shiki/themes/css-variables.json';

let highlighter: Highlighter;

/**
 * Server-side renders a code block with CSS variables
 */
export async function renderCssVariableHtml(props: { code: string; language: string }): Promise<string> {
  if (highlighter === undefined) {
    highlighter = await getHighlighter({
      theme: CssVariables as any,
    });
  }

  const tokens = highlighter.codeToThemedTokens(props.code, props.language);
  return renderToHtml(tokens, {
    fg: highlighter.getForegroundColor(),
    bg: highlighter.getBackgroundColor(),
    elements: {
      pre({ className, style, children }) {
        return `<pre class="${className} css-variable" style="${style}">${children}</pre>`;
      },
    },
  });
}
