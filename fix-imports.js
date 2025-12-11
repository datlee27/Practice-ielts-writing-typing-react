const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace version-specific imports with normal package names
  const patterns = [
    /(@radix-ui\/[^@]+)@\d+\.\d+\.\d+/g,
    /(class-variance-authority)@\d+\.\d+\.\d+/g,
    /(lucide-react)@\d+\.\d+\.\d+/g,
    /(react-hook-form)@\d+\.\d+\.\d+/g,
    /(next-themes)@\d+\.\d+\.\d+/g,
    /(react-day-picker)@\d+\.\d+\.\d+/g,
    /(input-otp)@\d+\.\d+\.\d+/g,
    /(embla-carousel-react)@\d+\.\d+\.\d+/g,
    /(cmdk)@\d+\.\d+\.\d+/g,
    /(sonner)@\d+\.\d+\.\d+/g,
    /(recharts)@\d+\.\d+\.\d+/g,
    /(react-resizable-panels)@\d+\.\d+\.\d+/g,
    /(vaul)@\d+\.\d+\.\d+/g,
  ];

  patterns.forEach(pattern => {
    const newContent = content.replace(pattern, '$1');
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// Recursively find all .tsx and .ts files in components/ui directory
function findAndFixFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAndFixFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImports(filePath);
    }
  });
}

// Run the script
const uiDir = path.join(__dirname, 'client/src/components/ui');
console.log('Fixing imports in UI components...');
findAndFixFiles(uiDir);
console.log('Done!');