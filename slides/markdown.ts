import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
})

export function renderMarkdown(source: string) {
  return markdown.render(source)
}

export function renderInlineMarkdown(source: string) {
  return markdown.renderInline(source)
}

export function markdownToPlainText(source: string) {
  return markdown
    .parseInline(source, {})
    .flatMap(token => token.children ?? [])
    .map(token => token.content)
    .join('')
}
