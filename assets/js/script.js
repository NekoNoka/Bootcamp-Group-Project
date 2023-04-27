let tableBody = document.querySelector('#firstA .content');
let searchBar = document.querySelector('.search_bar input');
let history = localStorage.getItem("historics") ? JSON.parse(localStorage.getItem("historics")) : [];

function getApi(event) {
   if (event.key !== "Enter") return;
   if (!searchBar.value) return;
   for (let i = 0; i < history.length; i++) {
      if (history[i].name === searchBar.value) return displayData(history[i].data);
   }
   let requestUrl = "http://www.omdbapi.com/?apikey=eeff1550" + "&s=" + searchBar.value;

   fetch(requestUrl).then(function (response) {
      response.json().then(function (data) {
         if (data.Response !== "True") return console.error("The search returned no results"); // we probably want to do more than logging an error.
         displayData(data.Search);
      });
   });
}

function displayData(data) {
   tableBody.innerHTML = "";
   for (let i = 0; i < data.length; i++) {
      let movie = data[i];
      let img = document.createElement('img');
      if (movie.Poster === "N/A") continue;
      img.src = movie.Poster;

      // more elements to add goes here.
      tableBody.appendChild(img);
   }
}

document.addEventListener("keydown", getApi);