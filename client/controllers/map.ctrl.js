angular.module('myApp')
    .controller('MapController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

    var self = this;

    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -7.214455941427701, lng: -395.90871261099613},
         zoom: 17,
      }
    );
  

    var styles = {
       default: null,
       hide: [
           {
             "featureType": "administrative",
             "elementType": "geometry",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "administrative.land_parcel",
             "elementType": "labels",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "poi",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "poi",
             "elementType": "labels.text",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "road",
             "elementType": "labels.icon",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "road.local",
             "elementType": "labels",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "transit",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           }
          ]
    };

    function addMarker(edificio){
        var location = new google.maps.LatLng(parseFloat(edificio.geolocalizacao.latitude), parseFloat(edificio.geolocalizacao.longitude));
        var marker = new google.maps.Marker({
           position: location,
           map: self.map
        });
        marker.addListener('click', function(ev) {
        $mdDialog.show({
            templateUrl: '../views/modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen
        });
    });
    };

    //Marker actionsudsadsgdjsgd
    /*var myLatlng = new google.maps.LatLng(-7.214455941427701,-395.90871261099613);
    var marker = new google.maps.Marker({
          position: myLatlng,
          map: self.map
    });

    marker.addListener('click', function(ev) {
        $mdDialog.show({
            templateUrl: '../views/modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen
        });
    });

    */
    //end


    var drawMakers = function() {
      $http.get("/edificio")
        .then(function(response) {
          var edificios = response.data;
          for (var i in edificios) {
            addMarker(edificios[i]);
          }
        })
    };

$scope.loadData = function () {

    $http.get("/edificio")
        .then(function(response, ev){

            $scope.data = response.data;
            console.log("arrombaram");
            for (var i in response.data){

            	if (response.data[i].hasOwnProperty('geolocalizacao') 
            		&& response.data[i]['geolocalizacao'].hasOwnProperty('latitude')){
            		console.log("entrou");

            		 addMarker(response.data[i]);
            	};

            }
             //return if uccess on fetch
            
        }, function() {
        	            console.log(response.data);
            $scope.data = "error in fetching data"; //return if error on fetch
        });
    };

    $scope.loadData();

    self.map.setOptions({styles: styles['hide']});

}]);