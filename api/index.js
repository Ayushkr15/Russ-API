const PORT = process.env.PORT || 3000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");  // <-- Make sure puppeteer is imported

const app = express();
const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/world/ukraine",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/world-60525350",
    base: "https://www.bbc.com/",
  },

  {
    name: "CNBC",
    address: "https://www.cnbc.com/europe-politics/",
    base: "",
  },
  {
    name: "Times of India",
    address: "https://timesofindia.indiatimes.com/world/europe",
    base: "https://timesofindia.indiatimes.com",
  },
  {
    name: "Aljazeera",
    address: "https://www.aljazeera.com/tag/ukraine-russia-crisis/",
    base: "https://www.aljazeera.com",
  },
  {
    name: "Ap News",
    address:
      "https://apnews.com/hub/russia-ukraine?utm_source=apnewsnav&utm_medium=featured",
    base: "https://apnews.com/",
  },
  {
    name: "The Hindu",
    address: "https://www.thehindu.com/topic/russia-ukraine-crisis/",
    base: "",
  },
  {
    name: "Independent",
    address: "https://www.independent.co.uk/news/world/europe",
    base: "https://www.independent.co.uk",
  },
  {
    name: "Abc News",
    address: "https://abcnews.go.com/International",
    base: "",
  },
  {
    name: "Reuters",
    address: "https://www.reuters.com/world/europe/",
    base: "https://www.reuters.com/",
  },
];

const articles = [];

async function fetchContentWithAxios(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching page with Axios:", error.message);
    return null;
  }
}

async function scrapeArticles() {
  articles.length = 0; // Clear any existing articles
  for (const newspaper of newspapers) {
    console.log(`Scraping ${newspaper.name}...`);
    const html = await fetchContentWithAxios(newspaper.address);
    if (!html) continue;

    const $ = cheerio.load(html);
    $("a").each(function () {
      const title = $(this).text().trim();
      const url = $(this).attr("href");
      if (title.includes("Ukraine") && url) {
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      }
    });
  }
  console.log(`Scraping completed. Total articles fetched: ${articles.length}`);
}

// Fetch articles when the server starts
(async () => {
  await scrapeArticles();
})();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RussAPI</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { background-color: #f8f9fa; color: #333; font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .btn { margin: 10px; }
      </style>
    </head>
    <body>
      <h1>Welcome to RussAPI</h1>
      <p>Get up-to-date news articles on the Ukraine conflict from various trusted sources.</p>
      <a href="/doc" class="btn btn-primary">View Documentation</a>
      <a href="/terms" class="btn btn-secondary">Terms of Use</a>
    </body>
    </html>
  `);
});

app.get("/doc", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RussAPI Documentation</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { background-color: #f8f9fa; color: #333; font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #007bff; }
        .endpoint { margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>RussAPI Documentation</h1>
        <p>This API allows you to retrieve news articles related to the Ukraine conflict from various sources.</p>
        <div class="endpoint">
          <h3>1. Get All News</h3>
          <p>Endpoint: <code>/news</code></p>
          <p>Returns a list of recent articles.</p>
        </div>
        <div class="endpoint">
          <h3>2. Get News by Publisher</h3>
          <p>Endpoint: <code>/news/{publisher_name}</code></p>
          <p>Retrieve articles from a specific publisher.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get("/terms", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RussAPI - Terms of Use</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { background-color: #f8f9fa; color: #333; font-family: Arial, sans-serif; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Terms of Use</h1>
        <p>Welcome to RussAPI! By accessing or using this API, you agree to abide by the following terms:</p>
        <ul>
          <li>This API is for informational purposes only.</li>
          <li>Do not use this API for any illegal or unauthorized purpose.</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.get("/news", (req, res) => {
  res.json(articles); // <-- Send actual articles here
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId.toLowerCase();
  const newspaper = newspapers.find(n => n.name.toLowerCase() === newspaperId);

  if (!newspaper) {
    return res.status(404).json({ error: "Newspaper not found" });
  }

  const html = await fetchContentWithAxios(newspaper.address);
  if (!html) {
    return res.status(500).json({ error: "Failed to fetch content" });
  }

  const $ = cheerio.load(html);
  const specificArticles = [];
  $("a").each(function () {
    const title = $(this).text().trim();
    const url = $(this).attr("href");
    if (title.includes("Ukraine") && url) {
      specificArticles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    }
  });
  res.json(specificArticles);
});


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

module.exports = app;
