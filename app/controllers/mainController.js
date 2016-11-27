var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: '0f2jWgY3vEesEKFqX5mJELrZr',
    consumer_secret: 'qikO3BHgFmsda2BZfoSCLJZ12iB88HVxIt0eWPiOCYaecf5g9o',
    access_token_key: '',
    access_token_secret: ''
});

var trumpTweets = [];

var mostUsedWords = [];
var hashtags = [];
var mentions = [];
var sortedByRetweets = [];
var sortedByFavs = [];

module.exports.getTweets = function(req, res){

var params = {screen_name: 'realdonaldtrump', include_rts: false};

client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {

        for(var i = 0; i < tweets.length; i++){

            trumpTweets[i] = {
                id: tweets[i].id_str,
                created_at : tweets[i].created_at,
                text: tweets[i].text,
                retweets: tweets[i].retweet_count,
                favorites: tweets[i].favorite_count,
            }

            var mentionsInTweet = tweets[i].text.match(/\B@[a-z0-9_-]+/gi);
            var hashtagsInTweet =  tweets[i].text.match(/\B#[a-z0-9_-]+/gi);

            if(mentionsInTweet != null){
                Array.prototype.push.apply(mentions, mentionsInTweet);
            }

            if(hashtagsInTweet != null){
                Array.prototype.push.apply(hashtags, hashtagsInTweet);
            }

            //remove punctuation, split and add to array
            Array.prototype.push.apply(mostUsedWords, tweets[i].text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" "));

        }

        hashtags.sort();
        mentions.sort();
        mostUsedWords.sort();

        sortedByRetweets = tweets.sort(function(a, b){
            return a.retweet_count < b.retweet_count;
        });

        sortedByFavs = tweets.sort(function(a, b){
            return a.favourite_count < b.favourite_count;
        });

    }

    // console.log(mostUsedWords);
    res.json({
        words: mostUsedWords
    });

});



}
