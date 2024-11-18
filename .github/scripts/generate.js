const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Configure marked for reveal.js compatibility
marked.setOptions({
  breaks: true
});

// HTML template for reveal.js presentations
const template = (content, title, options = {}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="reveal.js/dist/reveal.css">
    <link rel="stylesheet" href="reveal.js/dist/theme/${options.theme || 'black'}.css">
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        ${content}
      </div>
    </div>
    <script src="reveal.js/dist/reveal.js"></script>
    <script>
      Reveal.initialize({
        hash: true,
        plugins: [],
        ...${JSON.stringify(options)}
      });
    </script>
  </body>
</html>
`;

// Convert markdown content to reveal.js compatible HTML
function convertMarkdownToSlides(markdown) {
  // Split content into slides
  const slides = markdown.split(/\n---\n/)
    .map(slide => `<section>${marked(slide.trim())}</section>`)
    .join('\n');
  
  return slides;
}

// Process all markdown files
glob('PRESENTATIONS/**/*.md', (err, files) => {
  if (err) {
    console.error('Error finding markdown files:', err);
    process.exit(1);
  }

  files.forEach(file => {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const { attributes, body } = frontMatter(fileContent);
    const fileName = path.basename(file, '.md');
    
    // Convert markdown to HTML slides
    const slidesHtml = convertMarkdownToSlides(body);
    
    // Create HTML file with front matter options
    const outputPath = path.join('dist', `${fileName}.html`);
    fs.writeFileSync(
      outputPath,
      template(slidesHtml, fileName, attributes)
    );
    
    console.log(`Generated ${outputPath}`);
  });
}); 