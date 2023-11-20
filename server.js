const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`Mongodb connected with server:${data.connection.host}`);
})

// Create a schema for the URL model
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    created: {
        type: Date,
        default: Date.now,
    },
    hash: String,
    clicks: {
        type: Number,
        default: 0,
    },
});

// Create a model based on the schema
const Url = mongoose.model('Url', urlSchema);

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// API endpoint to shorten URL
app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    // Check if the URL is already in the database
    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
        res.json({ shortUrl: existingUrl.shortUrl });
    } else {
        let hash = shortid.generate();
        // Generate a short URL
        const shortUrl = 'http://localhost:5000/' + hash;

        // Save the URL to the database
        await Url.create({ originalUrl, shortUrl, hash: hash});

        res.json({ shortUrl });
    }
});

// Redirect to the original URL when short URL is visited
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    let shorturl= 'http://localhost:5000/' + shortUrl;

    // Find the original URL in the database
    const url = await Url.findOne({ shortUrl: shorturl});

    if (url) {
        // Redirect to the original URL
        res.redirect(301,url.originalUrl);

        // Increment the clicks counter
        url.clicks++;
        await url.save();
    } else {
        // Short URL not found
        res.status(404).send('Not Found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
