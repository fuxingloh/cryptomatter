import { getHighlighter, Highlighter, renderToHtml } from 'shiki';

let highlighter: Highlighter;

export async function renderCssVariableHtml(props: { code: string; language: string }): Promise<string> {
  if (highlighter === undefined) {
    highlighter = await getHighlighter({
      theme: 'css-variables',
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
