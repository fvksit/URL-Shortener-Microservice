require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false })); // Middleware untuk mem-parsing form data
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

let urlDatabase = [];
let urlCounter = 1;

app.post('/api/shorturl', (req, res) => {
    const { url } = req.body;

    const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
    if (!urlPattern.test(url)) {
        return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlCounter++;
    urlDatabase.push({ original_url: url, short_url: shortUrl });

    res.json({
        original_url: url,
        short_url: shortUrl
    });
});

app.get('/api/shorturl/:short_url', (req, res) => {
    const { short_url } = req.params;
    const urlEntry = urlDatabase.find(entry => entry.short_url == short_url);

    if (urlEntry) {
        return res.redirect(urlEntry.original_url);
    } else {
        return res.json({ error: 'No short URL found for the given input' });
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
