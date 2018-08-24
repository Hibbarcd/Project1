//Eventual Firebase Config here
/*
firebase.initializeApp(config);
var database = firebase.database();
*/

//Add a click event listener for randomize button that gets a 'random' word and does submitButton's code
//$('#randomButton').on('click', function () { useNewsAPI(getRandomWord()) });

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
                    <div class='row'>
                        <div class='col-md-6'>
                            <div class="card border aspect-ratio">
                                <h5 class="card-header">${article.title}</h5>
                                <div class="card-body">
                                    <div class="card-text cardPad">${article.description}</div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0"><p class="card-text">Published: ${month}-${day}-${year}
                                    <a href="${article.url}" class="btn btn-secondary float-right">Source</a></p>
                                </div>
                            </div>
                        </div>
                        <div class='col-md-6'>
                            <div class='border aspect-ratio'>
                                <iframe src="https://www.youtube.com/embed/${video.videoId}/" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    `);
}

