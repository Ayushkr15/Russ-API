const PORT = process.env.PORT || 3000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.static("public"));
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
  <title>RussAPI - Ukraine Conflict News</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/styles.css" rel="stylesheet">
  <style>
    body {
      overflow: hidden; /* Disable scrolling */
    }
  </style>
</head>
<body>
  <header class="bg-primary text-white text-center py-1">
    <div class="container">
      <h1 class="display-4">RussAPI</h1>
      <p class="lead">Stay Informed with the Latest News on the Ukraine Conflict</p>
    </div>
  </header>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <a class="navbar-brand" href="/">RussAPI</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="/news">News</a></li>
          <li class="nav-item"><a class="nav-link" href="/doc">Documentation</a></li>
          <li class="nav-item"><a class="nav-link" href="/terms">Terms of Use</a></li>
          <li class="nav-item"><a class="nav-link" href="/about">About Us</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <main>
    <section class="py-4 text-center">
      <div class="container">
        <h2>Welcome to RussAPI</h2>
        <p class="mb-4">Get up-to-date news articles on the Ukraine conflict from various trusted sources. Stay informed with reliable information and insights.</p>
        <a href="/news" class="btn btn-info">Get Latest News</a>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <h3 class="text-center mb-4">Features of RussAPI</h3>
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">Real-time news updates on the Ukraine conflict.</li>
              <li class="list-group-item">Curated content from reliable and trusted sources.</li>
              <li class="list-group-item">Comprehensive documentation for developers.</li>
              <li class="list-group-item">Easy integration with applications and websites.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 text-center">
      <div class="container">
        <h3>How to Use RussAPI</h3>
        <p>RussAPI provides a RESTful interface to fetch the latest news articles. Use the API endpoints to access news updates programmatically.</p>
        <a href="/doc" class="btn btn-secondary">View Documentation</a>
      </div>
    </section>
  </main>

  <footer class="bg-dark text-white text-center py-4">
    <div class="container">
      <p>Powered by RussAPI | Bringing you the latest news, efficiently.</p>
      <p>
        <a href="/terms" class="text-white">Terms of Use</a> |
        <a href="/about" class="text-white">About Us</a> |
        <a href="/contact" class="text-white">Contact</a>
      </p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
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
  <title>RussAPI Documentation</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/styles.css" rel="stylesheet">
</head>
<body>
  <header class="bg-secondary text-white text-center py-5">
    <div class="container">
      <h1 class="display-4">API Documentation</h1>
      <p class="lead">Integrate RussAPI into your applications seamlessly.</p>
    </div>
  </header>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <a class="navbar-brand" href="/">RussAPI</a>
      <!-- Navbar content same as before -->
    </div>
  </nav>

  <main class="container py-5">
    <h2>Getting Started</h2>
    <p>This API allows you to retrieve news articles related to the Ukraine conflict from various sources.</p>

    <div class="endpoint mt-5">
      <h3>1. Get All News</h3>
      <p><strong>Endpoint:</strong> <code>/news</code></p>
      <p>Returns a list of recent articles.</p>
      <pre><code>
GET /news
      </code></pre>
    </div>

    <div class="endpoint mt-5">
      <h3>2. Get News by Publisher</h3>
      <p><strong>Endpoint:</strong> <code>/news/{publisher_name}</code></p>
      <p>Retrieve articles from a specific publisher.</p>
      <pre><code>
GET /news/bbc
      </code></pre>
    </div>
  </main>

  <footer class="bg-dark text-white text-center py-4">
    <!-- Footer content same as before -->
  </footer>
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
  <title>RussAPI - Terms of Use</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/styles.css" rel="stylesheet">
</head>
<body>
  <header class="bg-dark text-white text-center py-5">
    <div class="container">
      <h1 class="display-4">Terms of Use</h1>
    </div>
  </header>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <!-- Navbar content same as before -->
  </nav>

  <main class="container py-5">
    <p>Welcome to RussAPI! By accessing or using this API, you agree to abide by the following terms:</p>
    <ul>
      <li>This API is for informational purposes only.</li>
      <li>Do not use this API for any illegal or unauthorized purpose.</li>
      <li>Respect the content policies of the original news sources.</li>
      <li>Attribute the news articles to their respective publishers when displaying or using the content.</li>
    </ul>
  </main>

  <footer class="bg-dark text-white text-center py-4">
    <!-- Footer content same as before -->
  </footer>
</body>
</html>
  `);
});

app.get("/about", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About Us - RussAPI</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/styles.css" rel="stylesheet">
</head>
<body>
  <header class="bg-info text-white text-center py-5">
    <div class="container">
      <h1 class="display-4">About RussAPI</h1>
    </div>
  </header>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <!-- Navbar content same as before -->
  </nav>

  <main class="container py-5">
    <p>RussAPI is dedicated to providing timely and reliable news updates on the Ukraine conflict. Our goal is to aggregate news from trusted sources to keep you informed.</p>
    <h3>Our Mission</h3>
    <p>To deliver accurate and up-to-date information in a user-friendly format.</p>
    <h3>Contact Us</h3>
    <p>For inquiries, please email us at <a href="mailto:contact@russapi.com">contact@russapi.com</a>.</p>
  </main>

  <footer class="bg-dark text-white text-center py-4">
    <!-- Footer content same as before -->
  </footer>
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
