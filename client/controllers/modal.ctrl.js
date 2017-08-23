angular.module('myApp')
    .controller('ModalController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.status = '  ';
        $scope.customFullscreen = false;

        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                templateUrl: '../views/modal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    }]);


angular.module('myApp')
    .controller('DialogController', ['$scope','$mdDialog', '$q', '$http', 'edificioService',
        function ($scope, $mdDialog, $q, $http, edificioService,) {

            var self = this;

            $scope.showInfos = false;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            var getPDF = function(){
                var q = $q.defer();
                if (!edificioService.isCaixa()){
                    var route = "/relatorio/edificio/" + $scope.edificio._id + "/pdf";
                    $http.get(route).then(function(info) {
                        q.resolve(info.data);
                        $scope.docDefinition = info.data;
                    }, function(info){
                        console.log('Rota errada')
                    });
                }
            };

            function getEstatisticas() {
                var q = $q.defer();
                if (!edificioService.isCaixa()){
                    console.log("Falsas");
                var route = "/estatistica/edificio/" + $scope.edificio._id;
                
                self.pontoDeConsumo = $scope.edificio;
                self.pontoDeConsumo.isUFCG = false;

                $http.get(route).then(function(info) {
                    q.resolve(info.data);
                    self.estatisticas = info.data;
                }, function(info){
                    console.log('Rota errada')
                });
            }
            else{
                console.log('Entrei aqui');
                var route = "/estatistica/caixa/" + $scope.edificio._id;
                $http.get(route).then(function(info) {
                    q.resolve(info.data);
                    self.estatisticas = info.data;
                }, function(info){
                    console.log('Rota errada')
                });

            };

                return q.promise;
            }
            $scope.pdf = function(){
                getPDF();
                pdfMake.createPdf($scope.docDefinition).download($scope.edificio.nome + '.pdf');
            };

            $scope.csvConsumos = function(){
                var q = $q.defer();
                if (!edificioService.isCaixa()){
                    var route = "/relatorio/edificio/" + $scope.edificio._id + "/csv/consumos";
                    $http.get(route).then(function(info) {
                        q.resolve(info.data);
                        $scope.docDefinition = info.data;
                    }, function(info){
                        console.log('Rota errada')
                    });
                }
            };

            var init = function () {
                getEstatisticas();
                getPDF();
            };

            init();
        }]);