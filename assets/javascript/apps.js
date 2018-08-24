//Eventual Firebase Config here
var config = {
    apiKey: "AIzaSyD__E2ZYbHa1WJAGNzsV9hxjndLC_uxTdY",
    authDomain: "news-and-views-92a23.firebaseapp.com",
    databaseURL: "https://news-and-views-92a23.firebaseio.com",
    projectId: "news-and-views-92a23",
    storageBucket: "news-and-views-92a23.appspot.com",
    messagingSenderId: "1016964464347"
  };
  firebase.initializeApp(config);

var database = firebase.database();
//=========================================================store to firebase
var searchQuery = "Randomness";
var randomQuery = "Randomness";
//=============================================================end of store to firebase

//Add a click event listener for randomize button that gets a 'random' word and does submitButton's code
$('#submitButton').on('click', function (event) {
    // useNewsAPI(getRandomWord()) 
    event.preventDefault();
    searchQuery = $("#submitInput").val().trim();
    database.ref('/users').push(searchQuery);
});

database.ref('/users').orderByChild("dateAdded").on("child_added", function (snapshot) {
    const users = snapshot.val();

    console.log(users);

 
    var searchTermBtn = $("<button>");

        // 3. Then give each "letterBtn" the following classes: "letter-button" "letter" "letter-button-color".

        // 5. Then give each "letterBtns" a text equal to "letters[i]".
    searchTermBtn.text(users);

        // 6. Finally, append each "letterBtn" to the "#buttons" div (provided).
    $("#buttons").append(searchTermBtn);
//Need to add firebase related events for retaining query information for top 10 or previous search lists
//  Pushing to database will be in query event only? Could push in random too!
//  Should add listener for database updates so the page can update if someone else searches something while it's loaded

//click event listen for submitButton
$('#submitButton').on('click', function () {

    const query = encodeURI($('#submitInput').val().trim()); // Eventually need INPUT VALIDATION!
    //Consider extracting to useNewsAPI method that #randomButton can dump its random word into as query
    const queryURL = `https://newsapi.org/v2/everything?q=${query}&sources=cnn,abc-news&sortBy=popularity&language=en&apiKey=d63c8717380a49a38ca6816cd34124b4`;

    $.get(queryURL).then((res) => {

        console.log(res); // Can remove after we settle final design!

        $('#articleDiv').empty();  //Get rid of previous results

        const articles = res.articles; // Extract article array

        //Build list of results in articleDiv
        for (i = 0; i < articles.length; i++) {

            //Cut out a readable date from the raw information
            const day = articles[i].publishedAt.substring(8, 10);
            const month = articles[i].publishedAt.substring(5, 7);
            const year = articles[i].publishedAt.substring(0, 4);

            //Append a card object to the articleDiv
            $('#articleDiv').append(`
            <div class="card border aspect-ratio">
                <h5 class="card-header">${articles[i].title}</h5>
                <div class="card-body">
                    <div class="card-text cardPad">${articles[i].description}</div>
                </div>
                <div class="card-footer bg-transparent border-top-0"><p class="card-text">Published: ${month}-${day}-${year}
                <a href="${articles[i].url}" class="btn btn-secondary float-right">Source</a></p>
                </div>
            </div>
            `);
            //TODO:  Combine article and video result into one div object that spans full page
            //       It will be much easier to format!  Waiting to figure out video API issues!
        }
    });
        //Need to figure out authentication or use issue!
        /*$.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURI(articles[0].title)}&safeSearch=strict&type=video&videoEmbeddable=true&key=AIzaSyDJqoHy0XZeGt8zGImByA59Maqgc7m3LZs`)
        .then((res) => {
            console.log(res);
        });*/
    });

});