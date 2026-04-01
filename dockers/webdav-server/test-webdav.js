const http = require('http');

const config = {
  host: '127.0.0.1',
  port: 8080,
  username: 'webdav',
  password: 'webdav123'
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
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
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

  // Test 1: PROPFIND with Depth header on a directory with content
  try {
    await makeRequest('MKCOL', '/propfind-test/');
    await makeRequest('PUT', '/propfind-test/dummy.txt', 'dummy');
    const res = await makeRequest('PROPFIND', '/propfind-test/', null, { 'Depth': '1' });
    if (res.statusCode === 207) {
      console.log('✓ PROPFIND /propfind-test/ returns 207 Multi-Status');
      passed++;
    } else {
      console.log(`✗ PROPFIND /propfind-test/ returned ${res.statusCode}, expected 207`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ PROPFIND test failed: ${err.message}`);
    failed++;
  }

  // Test 2: Upload a file
  try {
    const testContent = 'Hello WebDAV!';
    const res = await makeRequest('PUT', '/test-file.txt', testContent);
    if (res.statusCode === 201 || res.statusCode === 204) {
      console.log(`✓ PUT /test-file.txt returned ${res.statusCode}`);
      passed++;
    } else {
      console.log(`✗ PUT /test-file.txt returned ${res.statusCode}, expected 201/204`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ PUT /test-file.txt failed: ${err.message}`);
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
    console.log(`✗ GET /test-file.txt failed: ${err.message}`);
    failed++;
  }

  // Test 4: MKCOL to create a directory
  try {
    const res = await makeRequest('MKCOL', '/test-dir/');
    if (res.statusCode === 201 || res.statusCode === 405) {
      console.log(`✓ MKCOL /test-dir returned ${res.statusCode} (dir ${res.statusCode === 201 ? 'created' : 'already exists'})`);
      passed++;
    } else {
      console.log(`✗ MKCOL /test-dir returned ${res.statusCode}, expected 201`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ MKCOL /test-dir failed: ${err.message}`);
    failed++;
  }

  // Test 5: Upload file to subdirectory
  try {
    const res = await makeRequest('PUT', '/test-dir/nested-file.txt', 'nested content');
    if (res.statusCode === 201 || res.statusCode === 204) {
      console.log(`✓ PUT /test-dir/nested-file.txt returned ${res.statusCode}`);
      passed++;
    } else {
      console.log(`✗ PUT /test-dir/nested-file.txt returned ${res.statusCode}`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ PUT /test-dir/nested-file.txt failed: ${err.message}`);
    failed++;
  }

  // Test 6: DELETE the file
  try {
    const res = await makeRequest('DELETE', '/test-file.txt');
    if (res.statusCode === 204 || res.statusCode === 200) {
      console.log(`✓ DELETE /test-file.txt returned ${res.statusCode}`);
      passed++;
    } else {
      console.log(`✗ DELETE /test-file.txt returned ${res.statusCode}`);
      failed++;
    }
  } catch (err) {
    console.log(`✗ DELETE /test-file.txt failed: ${err.message}`);
    failed++;
  }

  // Test 7: Unauthenticated request should fail
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: config.host,
        port: config.port,
        path: '/',
        method: 'PROPFIND'
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
    console.log(`✗ Unauthenticated request failed: ${err.message}`);
    failed++;
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
