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
        function ($scope, $mdDialog, $q, $http, edificioService) {

              var ANUAL = 'anual';
                var MENSAL = 'mensal';
                var DIARIO = 'diario';
                var DETALHADO = 'detalhado';
                var GRANULARIDADE_ANO = 'year';
        var GRANULARIDADE_MES = 'month';
        var GRANULARIDADE_DIA = 'day';
        var GRANULARIDADE_HORA = 'hour';


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
            var getPDF = function(granularidadeR){
                var q = $q.defer();
                if (!edificioService.isCaixa()){
                    var route = "/relatorio/edificio/" + $scope.edificio._id + "/pdf";
                    $http.get(route).then(function(info) {
                        q.resolve(info.data);
                        $scope.docDefinition = info.data;
                     pdfMake.createPdf($scope.docDefinition).download($scope.edificio.nome + '.pdf');
                    }, function(info){
                    });
                }
            };

            function getEstatisticas() {
                var q = $q.defer();
                if (!edificioService.isCaixa()){
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
            $scope.pdf = function(granularidadeR){
                getPDF(granularidadeR);
               
            };

            $scope.csvConsumos = function(granularidadeR){
                                var gran;

            switch (granularidadeR) {
                case GRANULARIDADE_ANO:
                    gran = 'anual';
                    break;
                case GRANULARIDADE_MES:
                    gran = 'mensal';
                    break;
                case GRANULARIDADE_DIA:
                    gran = 'diario';
                    break;
                case GRANULARIDADE_HORA:
                    gran = 'detalhado';
                    break;
                default:
                    gran = 'diario';
            };

                var q = $q.defer();
                if (!edificioService.isCaixa()){
                    var route = "/relatorio/edificio/" + $scope.edificio._id + "/csv/consumos";
                    $http.get(route, {params: {granularidade: gran}}).then(function(info) {
                        q.resolve(info.data);

                    $scope.toJSON = '';
                                $scope.toJSON = angular.toJson($scope.data);
                                var blob = new Blob([info.data], { type:"text/css;charset=utf-8;" });           
                                var downloadLink = angular.element('<a></a>');
                                            downloadLink.attr('href',window.URL.createObjectURL(blob));
                                            downloadLink.attr('download', $scope.edificio.nome+'_'+ gran+ '.csv');
                                downloadLink[0].click();


                        $scope.docDefinition = info.data;
                    }, function(info){
                        console.log('Rota errada')
                    });
                }
            };

            var init = function () {
                getEstatisticas();
            };

            init();
        }]);