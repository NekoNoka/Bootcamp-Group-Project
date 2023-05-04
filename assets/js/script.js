let omdbImgContainer = document.querySelector('#firstA .content');
let nytimesImgContainer = document.querySelector('#secondA .content');
let searchBar = document.querySelector('.search_bar input');
let omdbStorage = localStorage.getItem("omdbStorage") ? JSON.parse(localStorage.getItem("omdbStorage")) : [];
let nytStorage = localStorage.getItem("nytimesStorage") ? JSON.parse(localStorage.getItem("nytimesStorage")) : [];
let omdbPageNumber = 1;
let previousSearch = "";
let lastOmdbPage = 1;

function getApi(newQuery) {
   if (newQuery) previousSearch = searchBar.value;
   if (!previousSearch) return;
   if (newQuery) omdbPageNumber = 1;
   // eeff1550
   // GrJLtpKFDzJKSy1um4IkiszoYQGrxb26
   let omdb = "https://www.omdbapi.com/?apikey=eeff1550&type=movie" + "&page=" + omdbPageNumber + "&s=" + previousSearch;
   let nytimes = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=GrJLtpKFDzJKSy1um4IkiszoYQGrxb26" + "&query=" + previousSearch;
   (function () {
      omdbImgContainer.innerHTML = "";
      let tempFound = false;
      for (let i = 0; i < omdbStorage.length; i++) {
         if (omdbStorage[i].name === previousSearch && omdbStorage[i].page == omdbPageNumber) {
            lastOmdbPage = Math.ceil(omdbStorage[i].total / 10);
            let movie = omdbStorage[i].value;
            let img = document.createElement('img');
            if (movie.Poster === "N/A") continue;
            img.src = movie.Poster;
            img.classList.add("poster");
            omdbImgContainer.appendChild(img);
            tempFound = true;
         }
      }
      if (tempFound) return;
      fetch(omdb).then(function (response) {
         response.json().then(function (json) {
            if (json.Response !== "True") return console.error("The search returned no results for omdb"); // we probably want to do more than logging an error.
            let data = json.Search;
            lastOmdbPage = Math.ceil(json.totalResults / 10);
            for (let i = 0; i < data.length; i++) {
               omdbStorage.push({ value: data[i], name: previousSearch, page: omdbPageNumber, total: json.totalResults });
               // var title = json['Title']
               // var time = json['Year']

               // movie.innerHTML = `Movie: ${title}`
               // Year.innerHTML = `Year: ${time} `

               let movie = data[i];
               let img = document.createElement('img');
               if (movie.Poster === "N/A") continue;
               img.classList.add("poster");
               img.src = movie.Poster;
               omdbImgContainer.appendChild(img);
            }
            localStorage.setItem("omdbStorage", JSON.stringify(omdbStorage));
         });
      });
   })();
   if (newQuery) {
      (function () {
         nytimesImgContainer.innerHTML = "";
         let tempFound = false;
         for (let i = 0; i < nytStorage.length; i++) {
            if (nytStorage[i].name === previousSearch) {
               let movie = nytStorage[i].value;
               let img = document.createElement('img');
               if (movie.multimedia === null) continue;
               img.classList.add("poster");
               img.src = movie.multimedia.src;
               nytimesImgContainer.appendChild(img);
               tempFound = true;
            }
         }
         if (tempFound) return;
         fetch(nytimes).then(function (response) {
            response.json().then(function (json) {
               if (json.status !== "OK") return console.error("The search broke for nytimes"); // we probably want to do more than logging an error.
               if (json.results === null) return console.error("The search returned no results for nytimes"); // we probably want to do more than logging an error.
               let data = json.results;
               for (let i = 0; i < data.length; i++) {
                  nytStorage.push({ value: data[i], name: previousSearch });
                  let movie = data[i];
                  let img = document.createElement('img');
                  if (movie.multimedia === null) continue;
                  img.classList.add("poster");
                  img.src = movie.multimedia.src;
                  nytimesImgContainer.appendChild(img);
               }
               localStorage.setItem("nytimesStorage", JSON.stringify(nytStorage));
            });
         });
      })();
   }
}
function setPage(id) {
   if (id == 1) {
      omdbPageNumber = 1
      getApi();
   }
   if (id == 2) {
      omdbPageNumber = 2
      getApi();
   }
   if (id == 3) {
      omdbPageNumber = 3
      getApi();
   }
   if (id == 4) {
      omdbPageNumber = 4
      getApi();
   }
   if (id == 5) {
      omdbPageNumber = lastOmdbPage
      console.log(lastOmdbPage);
      getApi();
   }
}


for (var i = 0; i < omdbStorage.length; i++) {
   for (var j = 0; j < nytStorage.length; j++) {
      if (omdbStorage[i].name.toLowerCase() == nytStorage[j].name.toLowerCase() && omdbStorage[i].value.Year == nytStorage[j].value.opening_date.slice(0, 4)) {
         // make api block 1 display movie poster,
         // make api block 2 display a review

      }

   }

}


