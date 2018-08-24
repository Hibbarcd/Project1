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
});

//Need to add firebase related events for retaining query information for top 10 or previous search lists
//  Pushing to database will be in query event only? Could push in random too!
//  Should add listener for database updates so the page can update if someone else searches something while it's loaded

/*
 * Click event listener for submitButton
 * uses submitInput for API calls to construct and display article+video pairs
*/
$('#submitButton').on('click', async function () {

    $('#contentDiv').empty(); // Remove existing results if there are any

    const query = encodeURI($('#submitInput').val().trim()); // Eventually need INPUT VALIDATION!
    //Consider extracting to useNewsAPI method that #randomButton can dump its random word into as query
    const queryURL = `https://newsapi.org/v2/everything?q=${query}&sources=cnn,abc-news&sortBy=popularity&language=en&apiKey=d63c8717380a49a38ca6816cd34124b4`;

    const res = await $.get(queryURL); //Pause execution until result

    for (let i = 0; i < res.articles.length; i++) {

        const article = res.articles[i]; // Get each article from response object

        requestVideo(article.title)  // Each call awaits a result before advancing
            .then((video) => {
                appendDiv(article, video); // Displays article+video result in contentDiv
            });

    }

});

/*
 * method breakout to carry article information through AJAX request
 */
async function requestVideo(title) {
    const res = await $.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURI(title)}&safeSearch=strict&type=video&videoEmbeddable=true&key=AIzaSyDJqoHy0XZeGt8zGImByA59Maqgc7m3LZs`)
    return { videoId: res.items[0].id.videoId, title }
}

/*
 * Appends article+video information to the contentDiv
 */
function appendDiv(article, video) {

    const day = article.publishedAt.substring(8, 10);
    const month = article.publishedAt.substring(5, 7);
    const year = article.publishedAt.substring(0, 4);

    $('#contentDiv').append(`
                    <div class='row mb-3'>
                        <div class='col-xl-6 my-2'>
                            <div class="card border aspect-ratio">
                                <h5 class="card-header cardHead">${article.title}</h5>
                                <div class="card-body pb-0">
                                    <div class="card-text"><p class="cardPad">${article.description}</p></div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0 pt-0"><p class="card-text">Published: ${month}-${day}-${year}
                                    <a href="${article.url}" class="btn btn-secondary float-right">Source</a></p>
                                </div>
                            </div>
                        </div>
                        <div class='col-xl-6 my-2'>
                            <div class='border aspect-ratio'>
                                <iframe src="https://www.youtube.com/embed/${video.videoId}/" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    `);
}

/*
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

    });
    // $('#articleDiv').empty();  //Get rid of previous results
*/
$("#randomButton").on('click', function () {

    var notReallyRandomWord = ['Caustic', 'Dominica', 'Genethlialogy', 'White House', 'Disasters', 'Epic', 'Football', 'Children', 'Mexico', 'Russia', 'Florida',];
    var randomWord = notReallyRandomWord[Math.floor(Math.random() * notReallyRandomWord.length)];
    // alert('Random Word is :' + randomWord);

    $("#submitInput").val(randomWord);

    //  $("#randomDiv").text(randomWord);

});
