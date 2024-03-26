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

// Indeed job search endpoint
app.get('/indeed', async (req, res) => {
  const searchUrl = 'https://www.indeed.com/jobs?q=Java&sc=0kf%3Ajt%28contract%29%3B&vjk=1b93328edf307cda';

  try {
    // Submit an async job to scrape the Indeed search results
    const { data: jobData } = await axios({
      data: {
        apiKey: API_KEY,
        url: searchUrl,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://async.scraperapi.com/jobs',
    });

    const jobId = jobData.id;
    const statusUrl = jobData.statusUrl;

    // Poll the status URL until the job is finished
    let jobStatus = 'running';
    while (jobStatus === 'running') {
      const { data: statusData } = await axios.get(statusUrl);
      jobStatus = statusData.status;

      if (jobStatus === 'finished') {
        // Job is finished, retrieve the HTML response
        const html = statusData.response.body;
        res.send(html);
        break;
      } else {
        // Job is still running, wait for a short interval before polling again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
