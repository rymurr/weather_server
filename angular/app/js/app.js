'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/historical', {templateUrl: 'partials/historical.html', controller: 'Historical'});
    $routeProvider.when('/current', {templateUrl: 'partials/current.html', controller: 'Current'});
    $routeProvider.otherwise({redirectTo: '/current'});
  }]);
