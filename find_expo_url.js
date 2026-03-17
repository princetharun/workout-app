const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'expo_final_capture.log');
const stream = fs.createWriteStream(logFile);

console.log('Starting Expo tunnel (final attempt)...');
const child = spawn('npx.cmd', ['expo', 'start', '--tunnel', '--port', '9010'], {
  cwd: __dirname,
  shell: true
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  stream.write(output);
  process.stdout.write(output);
  
  // Look for the URL pattern
  const expMatch = output.match(/exp:\/\/[\w.-]+:\d+/);
  if (expMatch) {
    console.log('\n\n>>> LINK FOUND: ' + expMatch[0] + ' <<<\n');
    fs.writeFileSync(path.join(__dirname, 'expo_url_found.txt'), expMatch[0]);
  }
});

child.stderr.on('data', (data) => {
  stream.write('ERROR: ' + data.toString());
});

setTimeout(() => {
  console.log('Timeout reached (2 mins). Closing...');
  child.kill();
  stream.end();
  process.exit(0);
}, 120000);
