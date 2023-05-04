let omdbImgContainer = document.querySelector('#firstA .content');
let nytimesImgContainer = document.querySelector('#secondA .content');
let searchBar = document.querySelector('.search_bar input');
let pagenumberDiv = document.querySelector(".pagenumber");
let omdbStorage = localStorage.getItem("omdbStorage") ? JSON.parse(localStorage.getItem("omdbStorage")) : [];
let nytStorage = localStorage.getItem("nytimesStorage") ? JSON.parse(localStorage.getItem("nytimesStorage")) : [];
let omdbPageNumber = 1;
let previousSearch = "";
let lastOmdbPage = 1;

function getApi(newQuery) {
   if (newQuery) previousSearch = searchBar.value;
   if (!previousSearch) return;
   if (newQuery) {
      omdbPageNumber = 1;
      pagenumberDiv.textContent = "Page: 1";
   }
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
            let title = movie.Title;
            let year = movie.Year;
            let container = document.createElement("div");
            let titleDiv = document.createElement("div");
            let yearDiv = document.createElement("div");
            let img = document.createElement('img');
            titleDiv.textContent = `Movie: ${title}`;
            yearDiv.textContent = `Year: ${year}`;
            if (movie.Poster !== "N/A") {
               img.src = movie.Poster;
               img.classList.add("poster");
            }
            container.classList.add("moviecard");
            titleDiv.classList.add("movietitle");
            container.appendChild(titleDiv);
            container.appendChild(yearDiv);
            container.appendChild(img);
            omdbImgContainer.appendChild(container);
            tempFound = true;
         }
      }
      if (tempFound) return;
      fetch(omdb).then(function (response) {
         response.json().then(function (json) {
            if (json.Response !== "True") return console.error("The search returned no results for omdb"); // we probably want to do more than logging an error.
            let data = json.Search;
            console.log(json);
            lastOmdbPage = Math.ceil(json.totalResults / 10);
            for (let i = 0; i < data.length; i++) {
               omdbStorage.push({ value: data[i], name: previousSearch, page: omdbPageNumber, total: json.totalResults });
               let movie = data[i];
               let title = movie.Title;
               let year = movie.Year;
               let container = document.createElement("div");
               let titleDiv = document.createElement("div");
               let yearDiv = document.createElement("div");
               let img = document.createElement('img');
               titleDiv.textContent = `Movie: ${title}`;
               yearDiv.textContent = `Year: ${year}`;
               if (movie.Poster !== "N/A") {
                  img.classList.add("poster");
                  img.src = movie.Poster;
               }
               container.classList.add("moviecard");
               titleDiv.classList.add("movietitle");
               container.appendChild(titleDiv);
               container.appendChild(yearDiv);
               container.appendChild(img);
               omdbImgContainer.appendChild(container);
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
               let container = document.createElement("div");
               let titleDiv = document.createElement("div");
               let yearDiv = document.createElement("div");
               let img = document.createElement('img');
               titleDiv.textContent = `Movie: Unknown`;
               yearDiv.textContent = `Year: Unknown`;
               if (movie.display_title !== null) {
                  let title = movie.display_title;
                  titleDiv.textContent = `Movie: ${title}`;
               }
               if (movie.opening_date !== null) {
                  let year = movie.opening_date.slice(0, 4);
                  yearDiv.textContent = `Year: ${year}`;
               }
               if (movie.multimedia !== null) {
                  img.classList.add("poster");
                  img.src = movie.multimedia.src;
               }
               container.classList.add("moviecard");
               titleDiv.classList.add("movietitle");
               container.appendChild(titleDiv);
               container.appendChild(yearDiv);
               container.appendChild(img);
               nytimesImgContainer.appendChild(container);
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
                  let container = document.createElement("div");
                  let titleDiv = document.createElement("div");
                  let yearDiv = document.createElement("div");
                  let img = document.createElement('img');
                  titleDiv.textContent = `Movie: Unknown`;
                  yearDiv.textContent = `Year: Unknown`;
                  if (movie.display_title !== null) {
                     let title = movie.display_title;
                     titleDiv.textContent = `Movie: ${title}`;
                  }
                  if (movie.opening_date !== null) {
                     let year = movie.opening_date.slice(0, 4);
                     yearDiv.textContent = `Year: ${year}`;
                  }
                  if (movie.multimedia !== null) {
                     img.classList.add("poster");
                     img.src = movie.multimedia.src;
                  }
                  container.classList.add("moviecard");
                  titleDiv.classList.add("movietitle");
                  container.appendChild(titleDiv);
                  container.appendChild(yearDiv);
                  container.appendChild(img);
                  nytimesImgContainer.appendChild(container);
               }
               localStorage.setItem("nytimesStorage", JSON.stringify(nytStorage));
            });
         });
      })();
   }
}
function setPage(id) {
   if (!previousSearch) return;
   if (id == 1) {
      omdbPageNumber = 1;
      pagenumberDiv.textContent = "Page: 1";
      getApi();
   }
   if (id == 2) {
      if (omdbPageNumber > 1) {
         omdbPageNumber--;
         pagenumberDiv.textContent = "Page: " + omdbPageNumber;
         getApi();
      }
   }
   if (id == 3) {
      if (omdbPageNumber < lastOmdbPage) {
         omdbPageNumber++;
         pagenumberDiv.textContent = "Page: " + omdbPageNumber;
         getApi();
      }
   }
   if (id == 4) {
      omdbPageNumber = lastOmdbPage;
      pagenumberDiv.textContent = "Page: " + omdbPageNumber;
      getApi();
   }
}


function a() {
   for (var i = 0; i < omdbStorage.length; i++) {
      for (var j = 0; j < nytStorage.length; j++) {
         if (omdbStorage[i].value.Title.toLowerCase() == nytStorage[j].value.display_title.toLowerCase() && omdbStorage[i].value.Year == nytStorage[j].value.opening_date.slice(0, 4)) {
            // make api block 1 display movie poster,
            // make api block 2 display a review
            nytimesImgContainer.innerHTML = "";
            {
               let movie = omdbStorage[i].value;
               let title = movie.Title;
               let year = movie.Year;
               let container = document.createElement("div");
               let titleDiv = document.createElement("div");
               let yearDiv = document.createElement("div");
               let img = document.createElement('img');
               titleDiv.textContent = `Movie: ${title}`;
               yearDiv.textContent = `Year: ${year}`;
               if (movie.Poster !== "N/A") {
                  img.src = movie.Poster;
                  img.classList.add("poster");
               }
               container.classList.add("moviecard");
               titleDiv.classList.add("movietitle");
               container.appendChild(titleDiv);
               container.appendChild(yearDiv);
               container.appendChild(img);
               omdbImgContainer.appendChild(container);
            }
            {
               let movie = nytStorage[i].value;
               let container = document.createElement("div");
               let summaryDiv = document.createElement("div");
               summaryDiv.textContent = `Summary: Unknown`;
               if (movie.summary_short !== null) {
                  let summary = movie.summary_short;
                  summaryDiv.textContent = `${summary}`;
               }
               container.classList.add("moviecard");
               container.appendChild(summaryDiv);
               nytimesImgContainer.appendChild(container);
            }
         }
      }
   }
}