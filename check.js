const fs = require('fs');
const content = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

let stack = [];
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.match(/<div[^>]*>/)) {
    let match = line.match(/<div[^>]*>/g);
    for (let j = 0; j < match.length; j++) {
      // Check if it's a self closing div (shouldn't happen but just in case)
      if (!match[j].includes('/>')) {
         stack.push({tag: 'div', line: i + 1});
      }
    }
  }
  if (line.match(/<\/div>/)) {
    let match = line.match(/<\/div>/g);
    for (let j = 0; j < match.length; j++) {
      if (stack.length > 0 && stack[stack.length - 1].tag === 'div') {
        stack.pop();
      } else {
        console.log('Unmatched </div> at line', i + 1);
      }
    }
  }
}
console.log('Unclosed tags:', stack);
