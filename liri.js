const keysFile = require('./keys');
const twitterKeys = keysFile.twitterKeys;
const omdbAPI = keysFile.omdbKey.api_key;
const spotifyKeys = keysFile.spotifyKeys;
const fs = require('fs');
const request = require('request');
const Twitter = require('twitter');
const SpotifyWebApi = require('spotify-web-api-node');
const client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('BQDsvBwkXXBMCllqN8KlNUZLhjtx8TqBqjDh69f-Z6V4_VsiC9QxuP_lMZ3rupzJg7EHdsheWo_Tb2FaMiwsqQ');
let command = process.argv[2];
let titleInput = process.argv[3];

function recentTweets() {
	let queryURL = 'statuses/user_timeline.json?screen_name=katie_starrett&count=20';
	client.get(queryURL, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text)
				console.log("Posted at: " + tweets[i].created_at);
				log( JSON.stringify(tweets[i].text) );
			}
		}
		else {
			console.log("Error! " + JSON.stringify(error) );
		}
	})
};

function songInfo() {
	spotifyApi.searchTracks('track:' + titleInput)
		.then(function(data) {
			firstResult = data.body.tracks.items[0];
			for (var i = 0; i < firstResult.artists.length; i++) {
				console.log("Artist: " + firstResult.artists[i].name);
			}
			console.log("Song title: " + firstResult.name);
			console.log("Album title: " + firstResult.album.name);
			console.log("Preview link: " + firstResult.external_urls.spotify);
			
		}, function(err) {
			console.log("Error! " + err);
		});
};

function movieInfo() {
	if ( titleInput === undefined) {
		titleInput = "Mr. Nobody";
	}

	let queryURL = "http://www.omdbapi.com/?t=" + titleInput + "&apiKey=" + omdbAPI;
	request(queryURL, function(err, response, body) {
		if( !err ) {
			if( response.statusCode === 200) {
				let responseObject = JSON.parse(body);
				console.log("Title: " + responseObject.Title);
				console.log("Year Released: " + responseObject.Year);
				console.log("IMDB Rating: " + responseObject.imdbRating);
				console.log("Country: " + responseObject.Country);
				console.log("Language: " + responseObject.Language);
				console.log("Plot: " + responseObject.Plot);
				console.log("Actors: " + responseObject.Actors);
				console.log("Rotten Tomatoes URL: " + 'http://www.rottentomatoes.com/m/' + responseObject.Title + "_" + responseObject.Year +"/");
				log(responseObject);
			}
			else{
				console.log("Your request to OMDB failed: " + "Status Code " + response.statusCode + ".");
			}
		}
		else{
			console.log("Error! " + err);
		}
	})
};

function random() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (!err) {
			data = data.split(",");
			command = data[0];
			titleInput = data[1];
			switch( command ) {
				case "my-tweets":
					recentTweets();
					break;
				case "spotify-this-song":
					songInfo();
					break;
				case "movie-this":
					movieInfo();
					break;
			};
		}
		else {
			console.log("Error! " + err);
		}
	})
};

function log(x) {
	fs.appendFile("log.txt", JSON.stringify(x) + "\n", function(err) {
		if( err ) {
			console.log("Error! " + err);
		}
	})
}

switch( command ) {
	case "my-tweets":
		recentTweets();
		break;
	case "spotify-this-song":
		songInfo();
		break;
	case "movie-this":
		movieInfo();
		break;
	case "do-what-it-says":
		random();
		break;
}