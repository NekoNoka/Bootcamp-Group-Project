var talbebody = document.getElementById('table')
var searchbar = document.getElementById('search-btn')



function getApi(){
     var requestUrl =" http://www.omdbapi.com/?i=tt3896198&apikey=eeff1550"

     fetch(requestUrl)
       .then(function(reponse){
          return reponse.json();
       })
       .then(function(data){
          console.log(data)

          for (var i = 0; i <data.length; i++)
          var createRow = document.createElement('cr  ');
          var tableBody= document.createElement('tb');
          var link = document.createElement('a');


          link.textContent = data[i].html_url;
        link.href = data[i].html_url;


        tableData.appendChild(link);
        createRow.appendChild(tableData);
        tableBody.appendChild(createTableRow);
      
       })
}


fetchButton.addEventListener('click',getApi)