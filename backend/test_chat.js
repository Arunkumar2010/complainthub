const http = require('http');

const post = (url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        } else {
          resolve(JSON.parse(body));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
};

const test = async () => {
  try {
    console.log('Logging in...');
    const loginRes = await post('http://localhost:5000/api/auth/login', {
      email: 'arun@gmail.com',
      password: '123456'
    });
    const token = loginRes.token;
    console.log('Login successful.');

    console.log('Testing Chatbot...');
    const chatRes = await post('http://localhost:5000/api/support/chat', {
      message: 'hi',
      history: []
    }, { Authorization: `Bearer ${token}` });

    console.log('Chatbot Reply:', chatRes.reply);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

test();
