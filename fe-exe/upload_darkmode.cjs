const fs = require('fs');
const path = require('path');
const https = require('https');

const imgPath = path.join(__dirname, 'public', 'BG_Darkmode.png');
const data = fs.readFileSync(imgPath);
const base64 = data.toString('base64');

const postData = new URLSearchParams({
  file: 'data:image/png;base64,' + base64,
  upload_preset: 'ml_default',
  folder: 'vistory',
  public_id: 'BG_Darkmode'
}).toString();

const options = {
  hostname: 'api.cloudinary.com',
  path: '/v1_1/duq6whfxw/image/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const result = JSON.parse(body);
      if (result.secure_url) {
        console.log('SUCCESS URL:', result.secure_url);
      } else {
        console.log('ERROR:', JSON.stringify(result.error));
        console.log('FULL RESPONSE:', body.substring(0, 500));
      }
    } catch(e) {
      console.log('PARSE ERROR:', e.message);
      console.log('BODY:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('REQUEST ERROR:', e));
req.write(postData);
req.end();
