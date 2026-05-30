require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


const dns = require('dns');
const urlParser = require('url');


app.use(express.urlencoded({ extended: true }));

//memoria
const urlDatabase = {};
let idCounter = 1;












// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});





//validar y guardar la URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = urlParser.parse(originalUrl);
  
  if (!parsedUrl.hostname || !['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) return res.json({ error: 'invalid url' });

    const shortUrl = idCounter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found' });
  }
});







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
