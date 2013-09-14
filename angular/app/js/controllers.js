'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Historical', ['$scope', '$http', function($scope, $http) {
      $scope.startDt = new Date();
      $scope.endDt = new Date();
      $scope.dates = { start_dt : new Date(2013,8,6,0,0,0,0),
                       end_dt   : new Date(),
                       maxDate  : new Date()};
      $scope.time = { start_time: new Date(2013,8,6,0,0,0,0),
                      end_time  : new Date(2013,8,6,0,0,0,0)};  
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
        $scope.changed();
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
        if (!$scope.deviceModel[obj.device]) {
            return false;
        }
        if (!$scope.sensorModel[obj.sensor]) {
            return false;
        }
        var dt = new Date(obj.timestamp*1000);
        if ($scope.startDt > dt) {
            return false;
        }
        if ($scope.endDt < dt) {
            return false;
        }
        return true;
      };
      $scope.changed = function() {
        $scope.startDt.setUTCDate($scope.dates.start_dt.getUTCDate());
        $scope.startDt.setUTCFullYear($scope.dates.start_dt.getUTCFullYear());
        $scope.startDt.setUTCMonth($scope.dates.start_dt.getUTCMonth());
        $scope.startDt.setUTCHours($scope.time.start_time.getUTCHours());
        $scope.startDt.setUTCMinutes($scope.time.start_time.getUTCMinutes());
        $scope.startDt.setUTCSeconds($scope.time.start_time.getUTCSeconds());
        $scope.endDt.setUTCDate($scope.dates.end_dt.getUTCDate());
        $scope.endDt.setUTCFullYear($scope.dates.end_dt.getUTCFullYear());
        $scope.endDt.setUTCMonth($scope.dates.end_dt.getUTCMonth());
        $scope.endDt.setUTCHours($scope.time.end_time.getUTCHours());
        $scope.endDt.setUTCMinutes($scope.time.end_time.getUTCMinutes());
        $scope.endDt.setUTCSeconds($scope.time.end_time.getUTCSeconds());
      };  
      $scope.data = [];
      for (var i=0;i<12;++i) {
        $scope.data.push({date:1379194270000-120000+i*10000,close:i+1});
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


