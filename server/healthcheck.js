import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 5001,
  path: '/api/health',
  timeout: 3000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Kenzna Server is healthy!');
    process.exit(0);
  } else {
    console.error(`❌ Healthcheck failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('❌ Healthcheck connection error:', err.message);
  process.exit(1);
});

request.end();
