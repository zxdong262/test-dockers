const { Client } = require('ssh2');

const config = {
  host: '127.0.0.1',
  port: 22236,
  username: 'root',
  password: 'root'
};

console.log('Testing open-rt SSH service...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Username: ${config.username}`);

const conn = new Client();

conn.on('ready', () => {
  console.log('✓ SSH connection established successfully');

  conn.exec('uname -a && test ! -x /bin/bash && echo "no-bash-ok"', (err, stream) => {
    if (err) {
      console.error('✗ Error executing SSH command:', err.message);
      conn.end();
      process.exit(1);
    }

    let stdout = '';

    stream.on('data', (data) => {
      stdout += data.toString();
    });

    stream.stderr.on('data', (data) => {
      console.error(`✗ stderr: ${data.toString().trim()}`);
    });

    stream.on('close', (code) => {
      if (code !== 0) {
        console.error(`✗ SSH command exited with code ${code}`);
        conn.end();
        process.exit(1);
      }

      console.log(`✓ SSH command output:\n${stdout.trim()}`);
      testSftpDisabled();
    });
  });
});

function testSftpDisabled() {
  conn.sftp((err, sftp) => {
    if (err) {
      console.log(`✓ SFTP is disabled as expected: ${err.message}`);
      conn.end();
      console.log('\n=== Test Summary ===');
      console.log('✓ SSH login works');
      console.log('✓ SFTP is disabled');
      console.log('✓ No bash binary available');
      process.exit(0);
      return;
    }

    console.error('✗ SFTP is enabled (unexpected)');
    sftp.end();
    conn.end();
    process.exit(1);
  });
}

conn.on('error', (err) => {
  console.error(`✗ SSH connection error: ${err.message}`);
  process.exit(1);
});

conn.connect(config);
