'use strict';

// Declare app level module which depends on views, and components
angular.module('fbSocial', [
  'ngRoute',
  'fbSocial.view1',
  'fbSocial.view2',
  'fbSocial.facebook'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/facebook'});
}]);
