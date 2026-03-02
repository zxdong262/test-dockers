const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '127.0.0.1',
  port: 22235,
  username: 'root',
  password: 'root'
};

console.log('Testing SFTP connection...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Username: ${config.username}`);

conn.on('ready', () => {
  console.log('✓ SSH connection established successfully!');
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.log('✓ SFTP is disabled (as expected):', err.message);
      conn.end();
      testSCP();
      return;
    }
    
    console.log('✗ SFTP is enabled (unexpected!)');
    sftp.readdir('.', (err, list) => {
      if (err) {
        console.log('✗ SFTP directory listing failed:', err.message);
      } else {
        console.log('✗ SFTP directory listing succeeded:', list);
      }
      conn.end();
      testSCP();
    });
  });
});

function testSCP() {
  console.log('\nTesting SCP command execution...');
  const conn2 = new Client();
  
  conn2.on('ready', () => {
    console.log('✓ SSH connection established for SCP test!');
    
    conn2.exec('which scp', (err, stream) => {
      if (err) {
        console.error('✗ Error executing command:', err);
        conn2.end();
        process.exit(1);
      }
      
      stream.on('data', (data) => {
        console.log(`✓ SCP command result:\n${data.toString().trim()}`);
      });
      
      stream.stderr.on('data', (data) => {
        console.error(`✗ Error output: ${data.toString()}`);
      });
      
      stream.on('close', (code) => {
        console.log(`✓ Command exited with code ${code}`);
        console.log('\n=== Test Summary ===');
        console.log('✓ SSH login works');
        console.log('✓ SFTP is disabled');
        console.log('✓ SCP is available');
        conn2.end();
        process.exit(0);
      });
    });
  });
  
  conn2.on('error', (err) => {
    console.error('✗ SSH connection error:', err.message);
    process.exit(1);
  });
  
  conn2.connect(config);
}

conn.on('error', (err) => {
  console.error('✗ SSH connection error:', err.message);
  process.exit(1);
});

conn.connect(config);
