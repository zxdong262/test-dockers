const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '127.0.0.1',
  port: 22234,
  username: 'root',
  password: 'root'
};

console.log('Attempting to connect to SSH server...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Username: ${config.username}`);

conn.on('ready', () => {
  console.log('✓ SSH connection established successfully!');
  
  conn.exec('whoami', (err, stream) => {
    if (err) {
      console.error('✗ Error executing command:', err);
      conn.end();
      process.exit(1);
    }
    
    stream.on('data', (data) => {
      console.log(`✓ Command output: ${data.toString().trim()}`);
    });
    
    stream.stderr.on('data', (data) => {
      console.error(`✗ Error output: ${data.toString()}`);
    });
    
    stream.on('close', (code) => {
      console.log(`✓ Command exited with code ${code}`);
      conn.end();
      process.exit(0);
    });
  });
});

conn.on('error', (err) => {
  console.error('✗ SSH connection error:', err.message);
  process.exit(1);
});

conn.connect(config);
