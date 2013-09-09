'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Historical', ['$scope', function($scope) {
  }])
  .controller('Current', ['$scope', '$http', function($scope, $http) {
      $http.get('/api/v1.0/meteo/measurement/_last').success(function(data){
        $scope.current = data;
      });
  }])
  .controller('MainPageControl', ['$scope', '$location', function($scope, $location){
    $scope.isCelsius=true;
    $scope.toggleUnit = function(active){
        $scope.isCelsius=active;
    };
    $scope.isActive = function(viewLocation) {
        return viewLocation == $location.path();
    };
  }]);


