export function isPreserveTag(tag) {
  const preserveTag = ['html', 'head', 'body', 'h1', 'div', 'span', 'select', 'input', 'option', 'button']
  return preserveTag.includes(tag)
}