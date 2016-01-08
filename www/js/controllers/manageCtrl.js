/**
 * Created by Romain Gaillard on 08/01/2016.
 */

angular.module('manage.controllers',['ngTable'])


    .controller('ManageCtrl', ['$scope', '$state','UserProvider','NgTableParams','$filter', function ($scope, $state,UserProvider,NgTableParams,$filter) {

        // ======== LES VARIABLES DU SCOPE ==========================

        $scope.newUser = {};

        // ========= LES FONCTIONS INTERNES ============================

        var getAllUsers = function(){
            UserProvider.getAll()
                .then(function(res){
                    var users = res;
                    console.log(res);

                    var data = users;
                    $scope.tableParamsUser = new NgTableParams({
                        page: 1,
                        count: 10,
                    },{
                        total:data.length,
                        getData: function ($defer, params) {
                            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });

                })
                .catch(function(err){
                    console.log(err);
                });
        }

        // ======== INITIALISATION ===================================

        getAllUsers();

        // ======== VARIABLES INTERNES ===============================

        // ========= LES ROUTES ======================================

        $scope.goToManageUsers = function () {
            $state.go("manageUsers");
        }
        $scope.goToManageTrucks = function () {
            $state.go("manageTrucks");
        }
        $scope.goToManagePannes = function () {
            $state.go("managePannes");
        }
        $scope.goToManageTypesPanne = function () {
            $state.go("manageTypesPanne");
        }
        $scope.goToManageRepairmans = function () {
            $state.go("manageRepairmans");
        }
        $scope.goToManageCompanys = function () {
            $state.go("manageCompanys");
        }

        $scope.goToBack = function(){
            $state.go("manageMenu");
        }

        // ========= LES FONCTIONS DU SCOPE ============================

        $scope.removeUser = function(id){
            UserProvider.remove(id).then(function(res) {
                getAllUsers();
            })
            .catch(function(err){
                console.log(err);
            });
        }


        $scope.createUser = function(){
            UserProvider.create($scope.newUser).then(function(res){
                getAllUsers();
            })
            .catch(function(err){
                console.log(err);
            })
        }


        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }])
