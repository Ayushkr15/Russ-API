const PORT = process.env.PORT || 3000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
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
    name: "Washington Post",
    address: "https://www.washingtonpost.com/world/ukraine-russia/",
    base: "",
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

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>API</title>
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: Arial, sans-serif;
			background-color: #F7F7F7;
		}

		header {
			background-color: #333;
			color: #fff;
			padding: 20px;
			text-align: center;
		}

		h1 {
			margin: 0;
			font-size: 36px;
		}

		main {
			max-width: 800px;
			margin: 0 auto;
			padding: 20px;
		}

		h2 {
			font-size: 24px;
			margin-top: 30px;
		}

		p {
			line-height: 1.5;
			margin: 10px 0;
		}

		.btn {
			display: inline-block;
			padding: 10px 20px;
			background-color: #333;
			color: #fff;
			text-decoration: none;
			border-radius: 5px;
			margin-top: 20px;
			font-weight: bold;
		}

		.btn:hover {
			background-color: #444;
		}
	</style>
</head>
<body>
	<header>
		<h1>Welcome to Russia Ukraine Conflict News API</h1>
	</header>
	<main>
		<h2>What is this API?</h2>
		<p>This API is a tool that allows developers and normal users to access data from various news Publishers.</p>
		<h2>How Does My API Work?</h2>
		<p>Developers can use HTTP requests to retrieve data from My API. The API will then return the requested data in a JSON format, making it easy to work with in any programming language.</p>
		<h2>Get Started with My API</h2>
		<p>Ready to start using My API? Checkout all the end points</p>
        <h3>1. To get all news:</h3>
        <span><i>www.russapi.co/news</i><br></span>
		<a href="www.russapi.co/news" class="btn">Get all news</a>
        <h3>2. To get news from particular publishers: </h3>
        <span><i>www.russapi.co/news/{publisher_name}</i><br></span>
        <p><b>Available options are:</b></p>
        <ul>
            <li>The Guardian</li>
            <li>BBC</li>
            <li>Washington Post</li>
            <li>CNBC</li>
            <li>Times of India</li>
            <li>Aljazeera</li>
            <li>Ap News</li>
            <li>The Hindu</li>
            <li>Independent</li>
            <li>Abc News</li>
            <li>Reuters</li>
        </ul>
        <p><b>Example:</b></p>
        <a href="www.russapi.co/news/bbc" class="btn">BBC</a>
	</main>
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
