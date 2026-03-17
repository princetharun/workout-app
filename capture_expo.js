const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'expo_capture.log');
const stream = fs.createWriteStream(logFile);

console.log('Starting Expo tunnel on port 8082...');
const child = spawn('npx.cmd', ['expo', 'start', '--tunnel', '--port', '8082'], {
  cwd: __dirname,
  shell: true
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  stream.write(output);
  if (output.includes('exp://')) {
    const match = output.match(/exp:\/\/[\w.-]+:\d+/);
    if (match) {
        console.log('EXPO_URL:' + match[0]);
    }
  }
});

child.stderr.on('data', (data) => {
  stream.write(data.toString());
});

setTimeout(() => {
  console.log('Timeout reached. Closing...');
  child.kill();
  stream.end();
  process.exit(0);
}, 60000);
