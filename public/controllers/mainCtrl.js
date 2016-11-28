app.controller('mainCtrl', function($http, $scope, $window){

    // $window.onLoad = function(){
    // $scope.getData = function(){

        $http({
            method: "GET",
            url: "/getData"
        }).then(function(response){

            // console.log(response);

            $scope.words = response.data.words;
            $scope.hashtags = response.data.hashtags;
            $scope.mentions = response.data.mentions;


        });

    // }

});
