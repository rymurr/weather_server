'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Historical', ['$scope', '$http', function($scope, $http) {
      $scope.dates = { start_dt : new Date(),
                       end_dt   : new Date(),
                       maxDate  : new Date()};
      $scope.currentPage = 0;
      $scope.pageSize = 25;
      $http.get('/api/v1.0/meteo/measurement/_find').success(function(data){
        $scope.historical = data;
        $scope.deviceModel = {};
        $scope.devices = [];
        $scope.sensorModel = {};
        $scope.sensors = [];
        var i=1;
        $scope.historical.items.map(function(obj){if (!(obj.device in $scope.deviceModel)){$scope.devices.push({'name':obj.device,'id':i});$scope.deviceModel[obj.device]=false;i+=1;}});    
        i=1;
        $scope.historical.items.map(function(obj){if (!(obj.sensor in $scope.sensorModel)){$scope.sensors.push({'name':obj.sensor,'id':i});$scope.sensorModel[obj.sensor]=false;i+=1;}});    
      });
      $scope.numberOfPages=function(){
          return Math.ceil($scope.historical.items.length/$scope.pageSize);                
      };
      $scope.dateConvert = function(timestamp){
        return new Date(timestamp*1000);
      };
      $scope.valueConvert = function(value, sensor){
        if (sensor === 'temperature') {
            if ($scope.isCelsius) {
                return parseFloat(value).toFixed(2) + ' &degC';
            } else {
                return parseFloat(value*9*0.2+32.0).toFixed(2) + ' &degF';
            }
        } else if (sensor === 'pressure') {
            return parseFloat(value).toFixed(2) + ' mBar';
        } else if (sensor === 'humidity') {
            return parseFloat(value).toFixed(2) + ' %';
        }
        return value;
      };
     $scope.tableFilter = function(obj) {
        if ($scope.deviceModel[obj.device] && $scope.sensorModel[obj.sensor]){
            return true;
        }
        return false;
    }   
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


