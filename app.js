/**
   Copyright 2014 AlchemyAPI

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var express = require('express');
var consolidate = require('consolidate');

var app = express();
var server = require('http').createServer(app);

//Create the AlchemyAPI object
// var AlchemyAPI = require('./alchemyapi');
// var alchemyapi = new AlchemyAPI();

var myUrl = "";

// all environments
app.engine('dust',consolidate.dust);
app.use(express.static('public'));
app.set('views',__dirname + '/views');
app.set('view engine', 'dust');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', example);

app.post('/', example);

var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('Express server listening on port ' + port);
	console.log('To view the example, point your favorite browser to: localhost:3000'); 
});



var demo_text = 'Yesterday dumb Bob destroyed my fancy iPhone in beautiful Denver, Colorado. I guess I will have to head over to the Apple Store and buy a new one.';
var demo_url = 'https://www.yelp.com/biz/ikes-place-san-francisco';
var demo_html = '<html><head><title>Node.js Demo | AlchemyAPI</title></head><body><h1>Did you know that AlchemyAPI works on HTML?</h1><p>Well, you do now.</p></body></html>';

var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('64be19b040593b9446df70e85ee2348248b2df2a');

// alchemy.keywords(myText, {'sentiment':1}, function(err,response) {
// 		// console.log("Sentiment: " + response["docKeywords"]["type"]);
// 		console.log(JSON.stringify(response, null, 4).length);
// });

function example(req, res) {
	var output = {};
	//Start the analysis chain
	text(req, res, output);
}

function text(req, res, output) {
	demo_text = "";
	// for(var i = 0; i < 101; i += 20) {
	// 	newUrl = myUrl + "?start=" + i;
		alchemy.text(req.body.url, {useMetadata:1}, function(err, response){
			console.log(response.text);
			demo_text += response.text + " ";
			escape(demo_text);
			keywords(req, res, output);
		});
	// }
}

function keywords(req, res, output) {
	console.log("keywords: "+ demo_text);
	// var myUrl = "https://www.yelp.com/biz/ikes-place-san-francisco";
	
	alchemy.keywords(req.body.url, {url:myUrl,'sentiment':1}, function(err,response) {
			var reviews = {};
			console.log(response['keywords']);
			for(var i = 0; i < response['keywords'].length; i++) {
				var delta = 50;
				var lo, hi;
				var index = demo_text.indexOf(response['keywords'][i]['text']);

				for(lo=index; lo > 0; lo--){
					if(demo_text[lo] == '.')
						break;
					if(index-lo > delta)
						break;
				}
				for(hi = index; hi<demo_text.length; hi++) {
					if(demo_text[hi] == '.')
						break;
					if(hi-index > delta)
						break;
				}
				var review = demo_text.substring(lo, hi).replace(/^\W+|\W+$/gm,'');
				console.log(review);
				reviews[response['keywords'][i]['text']] = review;
				// console.log(response['keywords'][i]['text']);
				// console.log(new RegExp(response['keywords']['text'],'i'));
				console.log((demo_text.match(new RegExp(response['keywords'][i]['text']))||[]).length);
			}
			console.log(JSON.stringify(response, null, 4).length);
			output['reviews'] = reviews;
			output['keywords'] = { text:myUrl, response:JSON.stringify(response,null,4), results:response['keywords'] };
			res.send(output);
	});
}


// function entities(req, res, output) {
// 	alchemyapi.entities('text', demo_text,{ 'sentiment':1 }, function(response) {
// 		output['entities'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['entities'] };
// 		keywords(req, res, output);
// 	});
// }


// function keywords(req, res, output) {
// 	alchemyapi.keywords('text', demo_text, { 'sentiment':1 }, function(response) {
// 		output['keywords'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['keywords'] };
// 		concepts(req, res, output);
// 	});
// }


// function concepts(req, res, output) {
// 	alchemyapi.concepts('text', demo_text, { 'showSourceText':1 }, function(response) {
// 		output['concepts'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['concepts'] };
// 		sentiment(req, res, output);
// 	});
// }


// function sentiment(req, res, output) {
// 	alchemyapi.sentiment('html', demo_html, {}, function(response) {
// 		output['sentiment'] = { html:demo_html, response:JSON.stringify(response,null,4), results:response['docSentiment'] };
// 		text(req, res, output);
// 	});
// }


// function text(req, res, output) {
// 	alchemyapi.text('url', demo_url, {}, function(response) {
// 		output['text'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		author(req, res, output);
// 	});
// }


// function author(req, res, output) {
// 	alchemyapi.author('url', demo_url, {}, function(response) {
// 		output['author'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		language(req, res, output);
// 	});
// }


// function language(req, res, output) {
// 	alchemyapi.language('text', demo_text, {}, function(response) {
// 		output['language'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response };
// 		title(req, res, output);
// 	});
// }


// function title(req, res, output) {
// 	alchemyapi.title('url', demo_url, {}, function(response) {
// 		output['title'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		relations(req, res, output);
// 	});
// }


// function relations(req, res, output) {
// 	alchemyapi.relations('text', demo_text, {}, function(response) {
// 		output['relations'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['relations'] };
// 		category(req, res, output);
// 	});
// }


// function category(req, res, output) {
// 	alchemyapi.category('text', demo_text, {}, function(response) {
// 		output['category'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response };
// 		feeds(req, res, output);
// 	});
// }


// function feeds(req, res, output) {
// 	alchemyapi.feeds('url', demo_url, {}, function(response) {
// 		output['feeds'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response['feeds'] };
// 		microformats(req, res, output);
// 	});
// }


// function microformats(req, res, output) {
// 	alchemyapi.microformats('url', demo_url, {}, function(response) {
// 		output['microformats'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response['microformats'] };
// 		taxonomy(req, res, output);
// 	});
// }


// function taxonomy(req, res, output) {
// 	alchemyapi.taxonomy('url', demo_url, {}, function(response) {
// 		output['taxonomy'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		combined(req, res, output);
// 	});
// }

// function combined(req, res, output) {
// 	alchemyapi.combined('url', demo_url, {}, function(response) {
// 		output['combined'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		image(req, res, output);
// 	});
// }

// function image(req, res, output) {
// 	alchemyapi.image('url', demo_url, {}, function(response) {
// 		output['image'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		image_keywords(req, res, output);
// 	});
// }

// function image_keywords(req, res, output) {
// 	alchemyapi.image_keywords('url', demo_url, {}, function(response) {
// 		output['image_keywords'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
// 		res.render('example',output);
// 	});
// }

