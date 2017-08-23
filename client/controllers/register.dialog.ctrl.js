angular.module('myApp')
    .controller('RegisterDialogController', ['$scope', '$location', 'AuthService', '$mdDialog', '$http',
        function ($scope, $location, AuthService, $mdDialog, $http) {

            var self = this;

            self.close = function () {
                $mdDialog.hide();
            };

            self.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register(self.username, self.password, self.confirm_pass)
                // handle success
                    .then(function () {
                        self.disabled = false;
                        self.registerForm = {};
                        self.close();
                    })
                    // handle error
                    .catch(function () {
                        self.error = true;
                        self.errorMessage = "Something went wrong!";
                        self.disabled = false;
                        self.registerForm = {};
                    });
            };
        }]);