const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const axios = require('axios');
var bodyParser = require('body-parser');
const app = express();
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const apiProxy = createProxyMiddleware('/api', {target: 'https://ekycportaldemo.innov8tif.com', changeOrigin: true});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
// app.use(apiProxy);

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

app.post('/api/okay/get-journey-id', async(req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;
  try{
    const response = await axios.post('https://ekycportaldemo.innov8tif.com/api/ekyc/journeyid', { username, password });
    res.json(response);
  }catch(e){
    res.json(e);
  }
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.get('/cors-handler', async(req, res) => {
  const url = req.query.url;
  const body = req.query.body;
  try{
    const data = await axios.get(url);
  }catch(e){
    console.log('got error', e);
  }
})

app.post('/cors-handler', async(req, res) => {
  const url = req.body.url;
  const body = req.body.body;
  console.log(url);
  console.log(body);
  try{
    const data = await axios.post(url);
  }catch(e){
    console.log('got error', e);
  }
})

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);

