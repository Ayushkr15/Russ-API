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
	<title>RussAPI</title>
 <link rel="shortcut icon" type="image/jpg" href="favicon.ico"/>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"      
		integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">

	   
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"      
		integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
		crossorigin="anonymous"></script>
	<style>
		body {
			height: 100vh;
			margin: 0;
			display: grid;
			grid-template-columns: auto auto;
			gap: 20px 50px;
			place-content: center;
			align-items: end;
		}

		.title {
			width: 60%;
			margin-top: 100px;
			margin-left: 30px
		}

		.hover-2 {
			--c: white;
			/* the color */
			--b: .1em;
			/* border length*/
			--d: 20px;
			/* the cube depth */

			--_s: calc(var(--d) + var(--b));

			color: var(--c);
			border: solid #0000;
			border-width: var(--b) var(--b) var(--_s) var(--_s);
			background:
				conic-gradient(at left var(--d) bottom var(--d),
					#0000 90deg, rgb(255 255 255 /0.3) 0 225deg, rgb(255 255 255 /0.6) 0) border-box,
				conic-gradient(at left var(--_s) bottom var(--_s),
					#0000 90deg, var(--c) 0) 0 100%/calc(100% - var(--b)) calc(100% - var(--b)) border-box;
			transform: translate(calc(var(--d)/-1), var(--d));
			clip-path:
				polygon(var(--d) 0%,
					var(--d) 0%,
					100% 0%,
					100% calc(100% - var(--d)),
					100% calc(100% - var(--d)),
					var(--d) calc(100% - var(--d)));
			transition: 0.5s;
		}

		.hover-2:hover {
			transform: translate(0, 0);
			clip-path:
				polygon(0% var(--d),
					var(--d) 0%,
					100% 0%,
					100% calc(100% - var(--d)),
					calc(100% - var(--d)) 100%,
					0% 100%);
		}

		h3 {
			font-family: system-ui, sans-serif;
			font-size: 4rem;
			margin: 0 auto;
			cursor: pointer;
			padding: 0 .1em;
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
			color: #fff;
			text-decoration: none;
			border-radius: 5px;
			margin-top: 20px;
			font-weight: bold;
			margin-left: 30px;
		}

		.btn:hover {
			background-color: #444;
		}

		#vanta {
			z-index: 0;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	</style>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
	<script>
		window.addEventListener('DOMContentLoaded', () => {
			VANTA.GLOBE({
				el: "#vanta",
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				minHeight: 200.00,
				minWidth: 200.00,
				scale: 1.00,
				scaleMobile: 1.00
			})
		})
	</script>
</head>

<body>
	<div id="vanta">
		<div class="title">
			<h3 class="hover-2">Welcome to Russia Ukraine Conflict News API</h3>
		</div>

    <a href="/doc" class="btn bg-secondary">Know more</a>

	</div>


	<script>
		var cursor = document.querySelector(".cursor");
		var cursor2 = document.querySelector(".cursor2");
		document.addEventListener("mousemove", function (e) {
			cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
		});
	</script>



	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" 
		integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk"
		crossorigin="anonymous"></script>


	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.min.js" 
		integrity="sha384-kjU+l4N0Yf4ZOJErLsIcvOU2qSb74wXpOhqTvwVx3OElZRweTnQ6d31fXEoRD1Jy"
		crossorigin="anonymous"></script>
</body>

</html>

  `);
});

app.get("/doc", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>RussAPI</title>
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
		<h1>How to use Russ API </h1>
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
		<a href="/news" class="btn">Get all news</a>
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
        <a href="/news/bbc" class="btn">BBC</a>
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
