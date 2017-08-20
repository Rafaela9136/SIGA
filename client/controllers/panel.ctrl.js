angular.module('myApp')
    .controller('PanelController', ['$scope', 'AuthService', '$mdDialog', '$location', '$http', 'edificioService', '$q',
        function ($scope, AuthService, $mdDialog, $location, $http, edificioService, $q) {

            var self = this;
            self.showEdificio = false;
            self.showUser = false;

            self.data = [];

            var user = AuthService.getUser();
            self.user_email = user.username;

            self.loadEdificios = function (ev) {
                self.showUser = false;
                self.showEdificio = true;

                $http.get("/edificio")
                    .then(function (response, ev) {
                        self.data = response.data;
                    }, function () {
                        self.data = "error in fetching data"; //return if error on fetch
                    });
            };

            self.loadUsers = function (ev) {
                self.showUser = true;
                self.showEdificio = false;
            };

            self.logoutDialog = function (ev) {
                self.showEdificio = false;
                self.showUser = true;

                var user = AuthService.getUser();

                $mdDialog.show({
                    templateUrl: '../views/logout.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };

            self.logout = function() {
                AuthService.logout()
                    .then(function () {
                        $location.path('/');
                    });

                self.close();
            };

            self.close = function(){
                $mdDialog.cancel();
            };

            self.updatePassword = function () {

                self.error = false;
                self.success = false;
                self.successMessage = "";
                self.errorMessage = "";
                $scope.disabled = true;
                var q = $q.defer();

                if (self.password === self.confirm_pass) {
                    $http.put('/userPassword',
                        { email: self.user_email, password: self.password })
                        .success(function (data, status) {
                            if (status == 200) {
                                self.successMessage = "Senha Atualizada!";
                                self.success = true;
                                self.showEditPass = false;
                                self.password = "";
                                self.confirm_pass = "";
                                q.resolve();
                            } else {
                                self.error = true;
                                self.errorMessage = "Tente novamente!"
                                q.reject();
                            }
                        })
                        .error(function (data) {
                            self.error = true;
                            self.errorMessage = "Tente novamente!"
                            q.reject();
                        });
                } else {
                    self.error = true;
                    self.errorMessage = "Senhas não coincidem!"
                    q.reject();
                }

                return q.promise;
            };

            self.newUserDialog = function (ev) {
                self.loadUsers();

                $mdDialog.show({
                    templateUrl: '../views/register-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: "RegisterDialogController",
                    controllerAs: 'ctrl'
                });
            };

            self.deleteUser = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.delete("/userDelete", {username: self.user_email})
                    .success(function(){
                        self.close();
                        console.log('muito bom');
                    })
                    .error(function(){
                        console.log('muito ruim');
                    });
            };

            self.editEdificio = function (ev, edificio) {
                edificioService.setEdificio(edificio);
                edificioService.setNew(false);

                $mdDialog.show({
                    templateUrl: '../views/manage-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };

            self.deleteEdificio = function(ev, edificio) {
                edificioService.setEdificio(edificio);
                edificioService.setNew(false);

                $mdDialog.show({
                    templateUrl: '../views/del-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            }

            self.newEdificio = function (ev) {
                var edInicial = {
                    nome: "", descricao: "", atividade: "",
                    caracteristicasFisicas: {
                        localizacao: { setor: "", bloco: "" },
                        area: 0, n_pavimentos: 0, ocupacaoMedia: 0,
                        n_baciasSanitarias: 0, n_torneiras: 0,
                        n_duchas: 0, n_chuveiros: 0, n_pias: 0,
                        volumeReservatorio: 0
                    }, geolocalizacao: {
                        latitude: 0,
                        longitude: 0
                    }, mediaEsperada: 0
                };

                edificioService.setEdificio(edInicial);
                edificioService.setNew(true);

                $mdDialog.show({
                    templateUrl: '../views/manage-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };
        }]);
