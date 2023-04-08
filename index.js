const PORT = process.env.PORT || 3000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const app = express();

const newspapers = [
  // your existing newspapers array
];

const articles = [];

newspapers.forEach(newspaper => {
  axios.get(newspaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Ukraine")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

// Define a new route for the landing page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Russia Ukraine Conflict news API</title>
      </head>
      <body>
        <h1>Welcome to my Russia Ukraine Conflict news API</h1>
        <p>This API provides news articles related to the ongoing conflict between Russia and Ukraine. You can use the /news endpoint to get all articles or the /news/:newspaperId endpoint to get articles from a specific newspaper.</p>
      </body>
    </html>
  `);
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Ukraine")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
