var Twitter = require('twitter');
var _ = require('lodash');

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

    var params = {screen_name: 'realdonaldtrump', include_rts: false, count: 3000};

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

            //sort by number of occurence
            mostUsedWords = _.chain(mostUsedWords).countBy().toPairs().sortBy(1).reverse().map(0).value();
            hashtags = _.chain(hashtags).countBy().toPairs().sortBy(1).reverse().map(0).value();
            mentions = _.chain(mentions).countBy().toPairs().sortBy(1).reverse().map(0).value();

            sortedByRetweets = tweets.sort(function(a, b){
                return a.retweet_count < b.retweet_count;
            });

            sortedByFavs = tweets.sort(function(a, b){
                return a.favourite_count < b.favourite_count;
            });

        }

        _.remove(mostUsedWords, function(a){
            return a == "" || a.includes("https");
        });

        //remove duplicates
        mostUsedWords = _.uniq(mostUsedWords);
        hashtags = _.uniq(hashtags);
        mentions = _.uniq(mentions);



        res.json({
            count: tweets.length,
            words: _.take(mostUsedWords, 20),
            mentions: _.take(mentions, 10),
            hashtags: _.take(hashtags, 10)
        });

    });



}
