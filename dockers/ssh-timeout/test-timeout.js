const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '127.0.0.1',
  port: 21220,
  username: 'root',
  password: 'root'
};

console.log('Attempting to connect to SSH server with TMOUT timeout settings...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Username: ${config.username}`);
console.log('Testing: If idle for 10+ seconds, shell should be terminated by TMOUT');

let connectedTime = null;

conn.on('ready', () => {
  console.log('✓ SSH connection established successfully!');
  connectedTime = Date.now();
  
  // Start an interactive shell
  conn.shell((err, stream) => {
    if (err) {
      console.error('✗ Error starting shell:', err);
      conn.end();
      process.exit(1);
    }
    
    console.log('✓ Shell started - now waiting for 15 seconds to test idle timeout...');
    
    // Wait for 15 seconds to test if the shell is terminated by TMOUT
    setTimeout(() => {
      console.log('✗ 15 seconds passed - checking if shell is still alive...');
      // The shell should have been closed by TMOUT after 10 seconds
    }, 15000);
    
    stream.on('close', (code, signal) => {
      if (connectedTime) {
        const elapsed = (Date.now() - connectedTime) / 1000;
        console.log(`✓ Shell closed after ${elapsed.toFixed(1)} seconds (code: ${code}, signal: ${signal})`);
        
        if (elapsed >= 8 && elapsed <= 20) {
          console.log('✓ SUCCESS: Shell was terminated due to TMOUT idle timeout (8-20 seconds)');
          conn.end();
          process.exit(0);
        } else if (elapsed < 8) {
          console.log('✗ FAILED: Shell was closed too quickly (less than 8 seconds)');
          conn.end();
          process.exit(1);
        } else {
          console.log('✗ FAILED: Shell stayed open too long (more than 20 seconds)');
          conn.end();
          process.exit(1);
        }
      }
    });
    
    stream.on('data', (data) => {
      console.log('Shell output:', data.toString().trim());
    });
    
    stream.stderr.on('data', (data) => {
      console.error('Shell error:', data.toString().trim());
    });
  });
});

conn.on('error', (err) => {
  console.error('✗ SSH connection error:', err.message);
  process.exit(1);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('✗ Uncaught error:', err.message);
  conn.end();
  process.exit(1);
});

conn.connect(config);
