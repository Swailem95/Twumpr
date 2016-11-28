app.controller('mainCtrl', function($http, $scope, $window){


    $scope.done = false;

    $http({
        method: "GET",
        url: "/getData"
    }).then(function(response){

        console.log(response);

        $scope.words = response.data.words;
        $scope.hashtags = response.data.hashtags;
        $scope.mentions = response.data.mentions;
        var retweets = response.data.topRetweets;
        var favs = response.data.topFavs;


        $scope.done = true;

    });



});
