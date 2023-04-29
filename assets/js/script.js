let omdbImgContainer = document.querySelector('#firstA .content');
let nytimesImgContainer = document.querySelector('#secondA .content');
let searchBar = document.querySelector('.search_bar input');
let history = localStorage.getItem("omdbStorage") ? JSON.parse(localStorage.getItem("omdbStorage")) : [];
let history2 = localStorage.getItem("nytimesStorage") ? JSON.parse(localStorage.getItem("nytimesStorage")) : [];

function getApi(event) {
   if (event.key !== "Enter") return;
   if (!searchBar.value) return;
   let omdb = "https://www.omdbapi.com/?apikey=eeff1550&type=movie" + "&s=" + searchBar.value ;
   let nytimes = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=GrJLtpKFDzJKSy1um4IkiszoYQGrxb26" + "&query=" + searchBar.value;
   (function(){
      for (let i = 0; i < history.length; i++) {
         if (history[i].name === searchBar.value) {
            omdbImgContainer.innerHTML = "";
            let data = history[i].value;
            for (let i = 0; i < data.length; i++) {
               let movie = data[i];
               let img = document.createElement('img');
               if (movie.Poster === "N/A") continue;
               img.src = movie.Poster;
               omdbImgContainer.appendChild(img);
            }
            return;
         }
      }
      fetch(omdb).then(function (response) {
         response.json().then(function (json) {
            if (json.Response !== "True") return console.error("The search returned no results for omdb"); // we probably want to do more than logging an error.
            history.push({ value: json.Search, name: searchBar.value });
            localStorage.setItem("omdbStorage", JSON.stringify(history));
            omdbImgContainer.innerHTML = "";
            let data = json.Search;
            for (let i = 0; i < data.length; i++) {
               let movie = data[i];
               let img = document.createElement('img');
               if (movie.Poster === "N/A") continue;
               img.src = movie.Poster;
               omdbImgContainer.appendChild(img);
            }
         });
      });
   })();
   (function(){
      for (let i = 0; i < history2.length; i++) {
         if (history2[i].name === searchBar.value) {
            nytimesImgContainer.innerHTML = "";
            let data = history2[i].value.results;
            for (let i = 0; i < data.length; i++) {
               let movie = data[i];
               let img = document.createElement('img');
               if (movie.multimedia === null) continue;
               img.src = movie.multimedia.src;
               nytimesImgContainer.appendChild(img);
            }
            return;
         }
      }
      fetch(nytimes).then(function (response) {
         console.log(response);
         response.json().then(function (json) {
            console.log(json.status, json);
            if (json.status !== "OK") return console.error("The search broke for nytimes"); // we probably want to do more than logging an error.
            if (json.results === null) return console.error("The search returned no results for nytimes"); // we probably want to do more than logging an error.
            history2.push({ value: json, name: searchBar.value });
            localStorage.setItem("nytimesStorage", JSON.stringify(history2));
            nytimesImgContainer.innerHTML = "";
            let data = json.results;
            console.log(data);
            for (let i = 0; i < data.length; i++) {
               let movie = data[i];
               let img = document.createElement('img');
               if (movie.multimedia === null) continue;
               img.src = movie.multimedia.src;
               nytimesImgContainer.appendChild(img);
            }
         });
      });
   })();
}

searchBar.addEventListener("keydown", getApi);