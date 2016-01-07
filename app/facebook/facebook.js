'use strict';

angular.module('fbSocial.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])

.config(function($facebookProvider) {
  $facebookProvider.setAppId('421362828060034');
  $facebookProvider.setPermissions("email, public_profile, user_posts, publish_actions, user_photos");
})

.run(function($rootScope) {
  // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.

  // Load the facebook SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

})

.controller('FacebookCtrl', ['$scope','$facebook', function($scope, $facebook) {
  $scope.isLoggedIn = false;
  $scope.welcomeMsg = "Please Log In";

  $scope.login = function(){
    $facebook.login().then(function(){
      $scope.isLoggedIn = true;
      refresh();
    });
  };

  function refresh() {
    var url = '/me?fields=name, first_name, last_name, email, gender, locale';
    $facebook.api(url).then(function(response){
      $scope.welcomeMsg = "Welcome " + response.name;
      $scope.isLoggedIn = true;
      $scope.userInfo = response;
      $facebook.api('/me/picture').then(function(response){
        $scope.picture = response.data.url;
        $facebook.api('/me/permissions').then(function(response){
          $scope.permissions = response.data;
          $facebook.api('/me/posts').then(function(response){
            $scope.posts = response.data;
          });
        });
      });
    },
    function(err){
      $scope.welcomeMsg = "Please Log In";
    });
  };

  $scope.logout = function(){
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      refresh();
    });
  };

  $scope.postStatus = function(){
    var body = this.body;
    this.body = "";
    $facebook.api('/me/feed', 'post', {message: body}).then(function(response){
      $scope.body = "";
      $scope.msg = "Status Posted";
      refresh();
    });
  };

}]);
