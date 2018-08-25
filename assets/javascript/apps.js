//Firebase Configuration
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
database.ref('/users').orderByChild("dateAdded").on("value", function (snapshot) {

    var data = [];

    snapshot.forEach(ss => {
        data.push(ss.val());
    })

    function buttonCreation() {
        for (i = data.length - 1; i > data.length - 11; i--) {
            if(data[i].length > 0) {
                var searchTermBtn = $("<button>");
                searchTermBtn.addClass("recentSearchButton btn btn-secondary m-2");
                searchTermBtn.attr("value", data[i]);
                searchTermBtn.text(data[i]);
                $("#buttons").append(searchTermBtn);
            }
        }
    }

    $("#buttons").empty();
    buttonCreation();

    $('#submitButton').on('click', function (event) {
        $("#buttons").empty();
        buttonCreation();
    });

    $(".recentSearchButton").on('click', function () {
        var recentSearchTerm = $(this).attr('value');
        $("#submitInput").val(recentSearchTerm);
    });
});
/*
 * Click event listener for submitButton
 * uses submitInput for API calls to construct and display article+video pairs
*/
$('#submitButton').on('click', async function () {
    event.preventDefault();
    $('#contentDiv').empty(); // Remove existing results if there are any
    const submitQuery = encodeURI($('#submitInput').val().trim()); // Eventually need INPUT VALIDATION!
    if (submitQuery.length > 0 && submitQuery.length < 256) { searchAPIs(submitQuery) }
    else { $('#contentDiv').html('<h1>Search Query must not be empty or longer than 256 letters!'); }
});
async function searchAPIs(query) {
    database.ref('/users').push(encodeURI(query));
    const queryURL = `https://newsapi.org/v2/everything?q=${query}&sources=cnn,abc-news&sortBy=popularity&language=en&apiKey=d63c8717380a49a38ca6816cd34124b4`;
    const res = await $.get(queryURL); //Pause execution until result
    for (let i = 0; i < res.articles.length; i++) {
        const article = res.articles[i]; // Get each article from response object
        requestVideo(article.title)  // Each call awaits a result before advancing
            .then((video) => {
                appendDiv(article, video); // Displays article+video result in contentDiv
            });
    }
}
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
$("#randomButton").on('click', function () {
    var notReallyRandomWord = ['Caustic', 'Dominica', 'Genethlialogy', 'White House', 'Disasters', 'Epic', 'Football', 'Children', 'Mexico', 'Russia', 'Florida',];
    var randomWord = notReallyRandomWord[Math.floor(Math.random() * notReallyRandomWord.length)];
    searchAPIs(randomWord);
});
