const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { marked } = require('marked');

// HTML template for reveal.js presentations
const template = (content, title) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="node_modules/reveal.js/dist/reveal.css">
    <link rel="stylesheet" href="node_modules/reveal.js/dist/theme/black.css">
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        ${content}
      </div>
    </div>
    <script src="node_modules/reveal.js/dist/reveal.js"></script>
    <script>
      Reveal.initialize({
        hash: true,
        plugins: []
      });
    </script>
  </body>
</html>
`;

// Find all markdown files in PRESENTATIONS directory
glob('PRESENTATIONS/**/*.md', (err, files) => {
  if (err) {
    console.error('Error finding markdown files:', err);
    process.exit(1);
  }

  files.forEach(file => {
    const markdown = fs.readFileSync(file, 'utf-8');
    const html = marked(markdown);
    const fileName = path.basename(file, '.md');
    
    // Create HTML file
    const outputPath = path.join('dist', `${fileName}.html`);
    fs.writeFileSync(outputPath, template(html, fileName));
    
    console.log(`Generated ${outputPath}`);
  });
}); 