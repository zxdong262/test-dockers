const http = require('http');

const config = {
  host: '127.0.0.1',
  port: 33333,
  username: 'admin',
  password: 'admin'
};

function makeRequest(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    const options = {
      hostname: config.host,
      port: config.port,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/octet-stream',
        ...extraHeaders
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('=== WebDAV Server Tests ===\n');

  // Test 1: PROPFIND on a directory
  try {
    await makeRequest('MKCOL', '/test-dir/');
    await makeRequest('PUT', '/test-dir/dummy.txt', 'dummy');
    const res = await makeRequest('PROPFIND', '/test-dir/', null, { 'Depth': '1' });
    if (res.statusCode === 207) {
      console.log('✓ PROPFIND /test-dir/ returns 207 Multi-Status');
      passed++;
    } else {
      console.log(`✗ PROPFIND /test-dir/ returned ${res.statusCode}, expected 207`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ PROPFIND test failed: ${err.message}`);
    failed++;
  }

  // Test 2: Upload a file
  try {
    const res = await makeRequest('PUT', '/test-file.txt', 'Hello WebDAV!');
    if (res.statusCode === 201 || res.statusCode === 204) {
      console.log(`✓ PUT /test-file.txt returned ${res.statusCode}`);
      passed++;
    } else {
      console.log(`✗ PUT /test-file.txt returned ${res.statusCode}, expected 201/204`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ PUT failed: ${err.message}`);
    failed++;
  }

  // Test 3: Download the file
  try {
    const res = await makeRequest('GET', '/test-file.txt');
    if (res.statusCode === 200 && res.body === 'Hello WebDAV!') {
      console.log('✓ GET /test-file.txt returned correct content');
      passed++;
    } else {
      console.log(`✗ GET /test-file.txt returned ${res.statusCode}, body: "${res.body}"`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ GET failed: ${err.message}`);
    failed++;
  }

  // Test 4: DELETE the file
  try {
    const res = await makeRequest('DELETE', '/test-file.txt');
    if (res.statusCode === 204 || res.statusCode === 200) {
      console.log(`✓ DELETE /test-file.txt returned ${res.statusCode}`);
      passed++;
    } else {
      console.log(`✗ DELETE returned ${res.statusCode}`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ DELETE failed: ${err.message}`);
    failed++;
  }

  // Test 5: Unauthenticated request should fail
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: config.host,
        port: config.port,
        path: '/',
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode }));
      });
      req.on('error', reject);
      req.end();
    });
    if (res.statusCode === 401) {
      console.log('✓ Unauthenticated request returns 401 Unauthorized');
      passed++;
    } else {
      console.log(`✗ Unauthenticated request returned ${res.statusCode}, expected 401`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ Unauthenticated test failed: ${err.message}`);
    failed++;
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
