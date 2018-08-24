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

        //Need to figure out authentication or use issue!
        /*$.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURI(articles[0].title)}&safeSearch=strict&type=video&videoEmbeddable=true&key=AIzaSyDJqoHy0XZeGt8zGImByA59Maqgc7m3LZs`)
        .then((res) => {
            console.log(res);
        });*/

        
        $('#randomButton').on('click', function () {
            
            var notReallyRandomWord = ['Caustic', 'Dominica', 'Genethlialogy', 'White House', 'Disasters', 'Epic' ];
            var notReallyRandomWord = notReallyRandomWord[Math.floor(Math.random()*notReallyRandomWord.length)];
            
            // $(".").text(randomNum);
            // $('#parent').append('<div>hello</div>'); 
            
            alert('Random Word is :' + notReallyRandomWord);
        })
        
        
    });
 

});