const getNewsButton = document.getElementById("get-news");
const articlesList = document.getElementById("articles-list");

getNewsButton.addEventListener("click", () => {
  fetch("/news")
    .then((response) => response.json())
    .then((data) => {
      articlesList.innerHTML = "";
      data.forEach((article) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${article.url}">${article.title}</a> - ${article.source}`;
        articlesList.appendChild(li);
      });
    })
    .catch((error) => console.error(error));
});
