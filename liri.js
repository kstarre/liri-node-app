const keysFile = require('./keys');
const twitterKeys = keysFile.twitterKeys;
const omdbAPI = keysFile.omdbKey.api_key;
const fs = require('fs');
const request = require('request');

let command = process.argv[2];
let titleInput = process.argv[3];

function recentTweets() {

};

function songInfo() {

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
				fs.appendFile("log.txt", JSON.stringify(responseObject) + "\n", function(err) {
					if( err ) {
						console.log("Could not write to the log.");
					}
				})
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

					break;
				case "spotify-this-song":

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

switch( command ) {
	case "my-tweets":

		break;
	case "spotify-this-song":

		break;
	case "movie-this":
		movieInfo();
		break;
	case "do-what-it-says":
		random();
		break;
}