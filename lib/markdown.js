import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';

export async function markdownToHtml(markdown) {
  try {
    if (!markdown) return '';
    const result = await remark().use(html).process(markdown);
    return result.toString();
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '<p>Error processing content</p>';
  }
}

export async function extractHeadings(markdown) {
  try {
    if (!markdown) return [];
    const headings = [];
    
    const processor = remark()
      .use(() => (tree) => {
        visit(tree, 'heading', (node) => {
          const text = node.children
            .filter(child => child.type === 'text')
            .map(child => child.value)
            .join('');
          
          // Create a more reliable slug for the heading ID
          let id = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special chars except whitespace and hyphens
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
          
          // Ensure ID is not empty
          if (!id) {
            id = `heading-${node.depth}-${headings.length}`;
          }
          
          headings.push({
            text,
            level: node.depth,
            id
          });
        });
      });
    
    await processor.process(markdown);
    return headings;
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

export async function markdownToHtmlWithHeadingIds(markdown) {
  try {
    if (!markdown) return '';
    // Extract headings first to get IDs
    const headings = await extractHeadings(markdown);
    
    // Add IDs to headings in the HTML
    const result = await remark()
      .use(() => (tree) => {
        visit(tree, 'heading', (node) => {
          const text = node.children
            .filter(child => child.type === 'text')
            .map(child => child.value)
            .join('');
          
          // Find the corresponding heading ID
          const heading = headings.find(h => h.text === text);
          if (heading) {
            // Add an ID property to the node's data
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.id = heading.id;
          } else {
            // Fallback ID if no match found
            const fallbackId = text
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-') || `heading-${node.depth}-fallback`;
            
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.id = fallbackId;
          }
        });
      })
      .use(html)
      .process(markdown);
    
    return result.toString();
  } catch (error) {
    console.error('Error converting markdown to HTML with heading IDs:', error);
    return '<p>Error processing content</p>';
  }
}
