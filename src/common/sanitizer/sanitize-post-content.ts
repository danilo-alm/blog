import sanitizeHtml from 'sanitize-html';

export function sanitizePostContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'p',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'blockquote',
      'img',
      'a',
      'em',
      'bold',
      'u',
      '<table>',
      '<thead>',
      '<tbody>',
      '<tfoot>',
      '<tr>',
      '<th>',
      '<td>',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {},
    transformTags: {
      h1: 'h2',
      h2: 'h3',
      h3: 'h4',
    },
  });
}
