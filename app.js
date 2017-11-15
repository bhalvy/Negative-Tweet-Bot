var twit = require('twit'),
    config = require('./bin/config.js'),
    nlp = require('compromise');

var Twitter = new twit(config),
    promises = [],
    theTweet,
    negative,
    urlToDelete,
    noUrl,
    acctToCheck = 'ENTER TWITTER ACCOUNT';

var getTweet = function(el) {
	return new Promise(function(resolve, reject) {
		var params = {
	      screen_name: el,
	      include_rts: false,
	      exclude_replies: true,
	      count: 1
	    }
		Twitter.get('statuses/user_timeline', params, function(err, data) {
		    if (!err) {
		    	// console.log(data)
		    	theTweet = data[0].text
		    	resolve(data)
		    }
		    else {
		      reject('Something went wrong while SEARCHING...');
		    }
		});
	})
}

promises.push(getTweet(acctToCheck))

Promise.all(promises)
	.then(function(){
		negative = nlp(theTweet).sentences().toNegative().out()
		urlToDelete = nlp(negative).urls().data();
		noUrl = nlp(negative).delete(urlToDelete).out()
		console.log(noUrl)
	})
	.then(function(){
		Twitter.post('statuses/update', { status: noUrl }, function(err, data, response) {})
})


