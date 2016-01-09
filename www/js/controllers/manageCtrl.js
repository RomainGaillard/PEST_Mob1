/**
 * Created by Romain Gaillard on 08/01/2016.
 */

angular.module('manage.controllers',['ngTable'])


    .controller('ManageCtrl', ['$scope', '$state','UserProvider','TruckProvider','NgTableParams','$ionicHistory', function ($scope, $state,UserProvider,TruckProvider,NgTableParams,$ionicHistory) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.newUser = {};
        $scope.newTruck = {};


        // ========= LES FONCTIONS INTERNES ============================

        var getAllUsers = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            UserProvider.getAll()
                .then(function(res){
                    console.log(res);
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
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

        var getAllTrucks = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            TruckProvider.getAll()
                .then(function(res){
                    console.log(res);
                    $scope.chargement = false;
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
                    $scope.tableParamsTruck = new NgTableParams({
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
        switch($ionicHistory.currentStateName()) {
            case "manageUsers":
                getAllUsers();
                break;
            case "manageTrucks":
                getAllTrucks();
                break;
        }

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

        $scope.removeTruck = function(id){
            TruckProvider.remove(id).then(function(res) {
                    getAllTrucks()
                })
                .catch(function(err){
                    console.log(err);
                });
        }

        $scope.createTruck = function(){
            console.log($scope.newTruck.running)
            TruckProvider.create($scope.newTruck).then(function(res){
                    getAllTrucks()
                })
                .catch(function(err){
                    console.log(err);
                })
        }

        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }])
