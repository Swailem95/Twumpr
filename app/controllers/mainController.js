var Twitter = require('twitter');
var _ = require('lodash');
var request = require('request');

var client = new Twitter({
    consumer_key: '0f2jWgY3vEesEKFqX5mJELrZr',
    consumer_secret: 'qikO3BHgFmsda2BZfoSCLJZ12iB88HVxIt0eWPiOCYaecf5g9o',
    access_token_key: '',
    access_token_secret: ''
});

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



            // sortedByRetweets = sortedByRetweets.map(function(a){
            //
            //     var id = a.id_str;
            //     var url = "http://publish.twitter.com/oembed?url=";
            //     var url2 = "https%3A%2F%2Ftwitter.com%2Frealdonaldtrump%2Fstatus%2F" + id;
            //     url += url2;
            //
            //     request(url, function (error, response, body) {
            //         if (!error && response.statusCode == 200) {
            //             a.embeddedHTML = JSON.parse(body).html;
            //             return a;
            //         }
            //
            //     });
            //
            // });


            sortedByFavs = tweets.sort(function(a, b){
                return a.favourite_count < b.favourite_count;
            });


            // sortedByFavs = sortedByFavs.map(function(a){
            //
            //     var id = a.id_str;
            //     var url = "http://publish.twitter.com/oembed?url=";
            //     var url2 = "https%3A%2F%2Ftwitter.com%2Frealdonaldtrump%2Fstatus%2F" + id;
            //     url += url2;
            //
            //     request(url, function (error, response, body) {
            //         if (!error && response.statusCode == 200) {
            //             a.embeddedHTML = JSON.parse(body).html;
            //             return a;
            //         }
            //     })
            //
            // });

        }

        _.remove(mostUsedWords, function(a){
            return a == "" || a.includes("https");
        });

        //remove duplicates
        mostUsedWords = _.uniq(mostUsedWords);
        hashtags = _.uniq(hashtags);
        mentions = _.uniq(mentions);

        mentions = mentions.map(function(a){
            return [a, "https://twitter.com/" + a.substring(1)];
        });

        hashtags = hashtags.map(function(a){
            return [a, "https://twitter.com/hashtag/" + a.substring(1)];
        })


        res.json({
            count: tweets.length,
            words: _.take(mostUsedWords, 20),
            mentions: _.take(mentions, 10),
            hashtags: _.take(hashtags, 10),
            topRetweets: _.take(sortedByRetweets, 5),
            topFavs: _.take(sortedByFavs, 5)
        });

    });



}
