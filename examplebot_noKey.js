/*

Sample Twitter Bot, using Wordnik (based on code by I. Bogost)

NOTE: this script requires the Node.js modules inflection, request, wordfilter, and twit

*/

// DEBUG
var debug = false;		// if we don't want it to post to Twitter! Useful for debugging!

// Wordnik stuff
var WordnikAPIKey = 'YOUR WORDNIK API KEY HERE';
var request = require('request');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
var pre;	// store prebuilt strings here.

// Blacklist
var wordfilter = require('wordfilter');

// Twitter Essentials
// Twitter Library
var Twit = require('twit');

// Include configuration file
var T = new Twit(require('./config.js'));

// Helper function for arrays, picks a random thing
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// Wordnik stuff
function nounUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

// Post a status update
function tweet() {

	var tweetText = pre.pick();

	if(debug) 
		console.log('Debug mode: ', tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function (err, reply) {
			if (err != null){
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}

function followAMentioner() {
	T.get('statuses/mentions_timeline', { count:50, include_rts:1 },  function (err, reply) {
		  if (err !== null) {
			console.log('Error: ', err);
		  }
		  else {
		  	var sn = reply.pick().user.screen_name;
			if (debug) 
				console.log(sn);
			else {
				//Now follow that user
				T.post('friendships/create', {screen_name: sn }, function (err, reply) {
					if (err !== null) {
						console.log('Error: ', err);
					}
					else {
						console.log('Followed: ' + sn);
					}
				});
			}
		}
	});
}

function respondToMention() {
	T.get('statuses/mentions_timeline', { count:100, include_rts:0 },  function (err, reply) {
		  if (err !== null) {
			console.log('Error: ', err);
		  }
		  else {
		  	mention = reply.pick();
		  	mentionId = mention.id_str;
		  	mentioner = '@' + mention.user.screen_name;
		  	
		  	var tweet = mentioner + " " + pre.pick();
			if (debug) 
				console.log(tweet);
			else
				T.post('statuses/update', {status: tweet, in_reply_to_status_id: mentionId }, function(err, reply) {
					if (err !== null) {
						console.log('Error: ', err);
					}
					else {
						console.log('Tweeted: ', tweet);
					}
				});
		  }
	});
}

function runBot() {
	console.log(" "); // just for legible logs
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);  // date/time of the request	

	// Get 200 nouns with minimum corpus count of 5,000 (lower numbers = more common words) 
	request(nounUrl(5000,200), function(err, response, data) {
		if (err != null) return;		// bail if no data
		nouns = eval(data);

		// Filter out the bad nouns via the wordfilter
		
		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word))
			{
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}

		pre = [
			"Dude, I haven't even started this essay on " + pluralize(nouns.pick().word) + " yet.",
			"I don't know how anybody can tolerate Prof. " + capitalize(singularize(nouns.pick().word)) + ". What a tool.", 
			"I'm so behind in my " + singularize(nouns.pick().word) + " class.",
			"I'm thinking of changing my major to " + capitalize(singularize(nouns.pick().word)) + " Studies.",
			"Seriously, " + capitalize(singularize(nouns.pick().word)) + " Engineering is ruining my life.",
			"I can't believe I forgot to bring my " + nouns.pick().word + " to lab again.",
			"Sooo much homework in this " + capitalize(nouns.pick().word) + " class. I should have taken " + capitalize(nouns.pick().word) + " instead.",
			"Almost the weekend! Totally amped for the " + nouns.pick().word + " party.",
			"Seriously I have had enough of Intro to " + capitalize(nouns.pick().word) + ".",
			"Who's coming to Club " + capitalize(singularize(nouns.pick().word)) + " tonight? I'm DJing along with my bro " + capitalize(nouns.pick().word) + ".",
			"Missed class again. Too many " + pluralize(nouns.pick().word) + " last night."
			// etc.			
		];
		
		///----- NOW DO THE BOT STUFF
		var rand = Math.random();

 		if(rand <= 1.60) {      
			console.log("-------Tweet something");
			tweet();
			
		} else if (rand <= 0.80) {
			console.log("-------Tweet something @someone");
			respondToMention();
			
		} else {
			console.log("-------Follow someone who @-mentioned us");
			followAMentioner();
		}
	});
}

// Run the bot
runBot();

// And recycle every hour
setInterval(runBot, 1000 * 60 * 60);
