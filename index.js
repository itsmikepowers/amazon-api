const express = require('express');
const request = require('request-promise');
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

const API_KEY = '5db8cc3726e79e74070f315c73cd5e38';

const returnScraperApiUrl = () => `http://api.scraperapi.com?api_key=${API_KEY}&autoparse=true`;

// Welcome route
app.get('/', async (req, res) => {
  res.send('Welcome to Amazon Scraper API!');
});

// Ping route for Rapid API
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

// Get product details
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await request(`${returnScraperApiUrl()}&url=https://www.amazon.com/dp/${productId}`);
    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Get product reviews
app.get('/products/:productId/reviews', async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await request(`${returnScraperApiUrl()}&url=https://www.amazon.com/product-reviews/${productId}`);
    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Get product offers
app.get('/products/:productId/offers', async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await request(`${returnScraperApiUrl()}&url=https://www.amazon.com/gp/offer-listing/${productId}`);
    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Get search results
app.get('/search/:searchQuery', async (req, res) => {
  const { searchQuery } = req.params;
  try {
    const response = await request(`${returnScraperApiUrl()}&url=https://www.amazon.com/s?k=${searchQuery}`);
    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
