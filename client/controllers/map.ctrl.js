angular.module('myApp')
    .controller('MapController', ['$scope', '$http', '$mdDialog', '$window', function($scope, $http, $mdDialog, $window) {

    var self = this;
	  self.markers = {};
    var icons = { todos: {size: new google.maps.Size(30, 30),
                                scaledSize: new google.maps.Size(30, 30),
                                url: '../lib/icons/marker_blue.png'},
                  alerta0: {size: new google.maps.Size(30, 30),
                            scaledSize: new google.maps.Size(30, 30),
                            url:'../lib/icons/marker_yellow.png'},
                  alerta1: {size: new google.maps.Size(30, 30),
                            scaledSize: new google.maps.Size(30, 30),
                            url:'../lib/icons/marker_red.png'}
                  };

    function addMarker(edificio, icon){

    	// sets the current location from the edificio data
        var location = {lat:parseFloat(edificio.geolocalizacao.latitude), lng: parseFloat(edificio.geolocalizacao.longitude) };

        var marker = new google.maps.Marker({
           position: location,
           icon: icon,
           map: self.map,
           edificio: edificio._id
        });


        // modal referring to the current building
        marker.addListener('click', function(ev) {
          $scope.edificio = edificio;

          $mdDialog.show({
              templateUrl: '../views/modal.html',
              parent: angular.element(document.body),
              scope: $scope.$new(), 
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen
          });
        });
        self.markers[edificio._id] = marker;
    };

    
// request the edificios' data from the api and send it to the addMarker method to be drawn
$scope.loadData = function () {

    $http.get("/edificio", {params: {withAlerta: true}})
        .then(function(response, ev){
            $scope.data = response.data;
            for (i in response.data){
              for (j in response.data[i]) {
              	var edificio = response.data[i][j];
              	// the following line checks if the json edificio object have the required params to be drawn
              	if (edificio.hasOwnProperty('geolocalizacao') 
              		&& edificio['geolocalizacao'].hasOwnProperty('latitude')){
              	   addMarker(edificio, icons[i]);
              	};
              }
            }
             //return if uccess on fetch
            
        }, function() {
        	            console.log(response.data);
            $scope.data = "error in fetching data"; //return if error on fetch
        });
    };

self.initMap = function(){
    //draws the base map calling the google api 
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -7.214455941427701, lng: -395.90871261099613},
         zoom: 17,
      }
    );

    $scope.loadData();
 self.map.setOptions({styles: styles['hide']}); 

};

self.initMap();
   // removes the non necessary info from the map

    self.showOnlySetor = function(setor){
    	for (key in self.markers){
    		self.markers[key].setVisible(false);
    	};
    	$http.get("/edificio",  {
    params: { setor: setor }})
        .then(function(response, ev){
            for (var i in response.data){
            	var edificio = response.data[i];
            	self.markers[edificio._id].setVisible(true);
             //return if uccess on fetch
			}            
        }, function() {
            $scope.data = "error in fetching data"; //return if error on fetch
        });

    };

    self.showEdificiosAlerta = function(nivelAlerta) {
      for (key in self.markers){
        self.markers[key].setVisible(false);
      };
      $http.get("/edificio", { params: {nivelAlerta: nivelAlerta }})
        .then(function(response, ev) {
          for (var i in response.data) {
            var edificio = response.data[i];
            console.log(edificio);
            if (nivelAlerta == '1') {
              self.markers[edificio._id].setIcon(icons.alerta1);
              self.markers[edificio._id].setVisible(true);
            } else if (nivelAlerta == '0') {
              self.markers[edificio._id].setIcon(icons.alerta0);
              self.markers[edificio._id].setVisible(true);
            }
          }
        });
    };

var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

this.redial = function() {
  for (key in self.markers){
        self.markers[key].setVisible(true);
  };
};

}]);