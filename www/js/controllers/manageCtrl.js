/**
 * Created by Romain Gaillard on 08/01/2016.
 */

angular.module('manage.controllers',['ngTable'])

    .controller('ManageCtrl', ['$scope', '$state','UserProvider','TruckProvider','PanneProvider','CompanyProvider','TypePanneProvider','NgTableParams','$ionicHistory','Storage',
        function ($scope, $state,UserProvider,TruckProvider,PanneProvider,CompanyProvider,TypePanneProvider,NgTableParams,$ionicHistory,Storage) {


        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.newUser = {};
        $scope.newTruck = {};
        $scope.newPanne = {};
        $scope.newCompany = {};
        $scope.newTypePanne = {};
        $scope.typesPanne = {};
        $scope.myUser = Storage.getStorage("user").data.user;
        if($scope.myUser.right == "Gestionnaire"){
            $scope.newUser.company = $scope.myUser.company;
        }

        $scope.trucks = new Array();
        $scope.users = new Array();

        // ========= LES FONCTIONS INTERNES ============================

        var getAllUsers = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            UserProvider.getAll()
                .then(function(res){
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
                    $scope.users = res;
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
        };

        var getAllTrucks = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            TruckProvider.getAll()
                .then(function(res){
                    $scope.trucks = res;
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
        };

        var getAllPannes = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            PanneProvider.getAll()
                .then(function(res){
                    console.log(res);
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
                    $scope.tableParamsPanne = new NgTableParams({
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
        };

        var getAllCompanys = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            CompanyProvider.getAll()
                .then(function(res){
                    console.log(res);
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
                    $scope.tableParamsCompany = new NgTableParams({
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
        };

        var getAllTypesPanne = function(){
            $(".table-responsive").hide();
            $(".chargement").show();
            TypePanneProvider.getAll()
                .then(function(res){
                    console.log(res);
                    $(".chargement").slideUp("slow");
                    $(".table-responsive").slideDown("slow");
                    var data = res;
                    $scope.tableParamsTypePanne = new NgTableParams({
                        page: 1,
                        count: 10,
                    },{
                        total:data.length,
                        getData: function ($defer, params) {
                            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });
                    $scope.typesPanne = res;
                    if($ionicHistory.currentStateName()=="managePannes")
                        $scope.newPanne.typePanne = $scope.typesPanne[0];
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        // ======== INITIALISATION ===================================
        switch($ionicHistory.currentStateName()) {
            case "manageUsers":
                getAllTrucks();
                getAllUsers();
                break;
            case "manageTrucks":
                getAllUsers();
                getAllTrucks();
                break;
            case "managePannes":
                getAllTypesPanne();
                getAllPannes();
                break;
            case "manageCompanys":
                getAllCompanys();
                break;
            case "manageTypesPanne":
                getAllTypesPanne();
                break;
        }

        // ======== VARIABLES INTERNES ===============================

        // ========= LES ROUTES ======================================

        $scope.goToManageUsers = function () {
            $state.go("manageUsers");
        };
        $scope.goToManageTrucks = function () {
            $state.go("manageTrucks");
        };
        $scope.goToManagePannes = function () {
            $state.go("managePannes");
        };
        $scope.goToManageTypesPanne = function () {
            $state.go("manageTypesPanne");
        };
        $scope.goToManageCompanys = function () {
            $state.go("manageCompanys");
        };

        $scope.goToBack = function(){
            $state.go("manageMenu");
        };

        $scope.goToHomeGestionnaire = function(){
            $state.go("homeGestionnaire");
        }

        // ========= LES FONCTIONS DU SCOPE ============================

        $scope.changeTruck = function(user){
            UserProvider.update(user.id,user);
        };


        $scope.removeUser = function(id){
            UserProvider.remove(id).then(function(res) {
                    getAllUsers();
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.createUser = function(){
            UserProvider.create($scope.newUser).then(function(res){
                    getAllUsers();
                })
                .catch(function(err){
                    console.log(err);
                })
        };

        $scope.removeTruck = function(id){
            TruckProvider.remove(id).then(function(res) {
                    getAllTrucks()
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.createTruck = function(){
            console.log($scope.newTruck.running)
            TruckProvider.create($scope.newTruck).then(function(res){
                    getAllTrucks()
                })
                .catch(function(err){
                    console.log(err);
                })
        };

        $scope.removePanne = function(id){
            PanneProvider.remove(id).then(function(res) {
                    getAllPannes();
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.createPanne = function(){
            console.log($scope.newPanne.typePanne)
            PanneProvider.create($scope.newPanne).then(function(res){
                    getAllPannes();
                })
                .catch(function(err){
                    console.log(err);
                })
        };

        $scope.removeCompany = function(id){
            CompanyProvider.remove(id).then(function(res) {
                    getAllCompanys();
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.createCompany = function(){
            console.log($scope.newCompany.type);
            CompanyProvider.create($scope.newCompany).then(function(res){
                    getAllCompanys();
                })
                .catch(function(err){
                    console.log(err);
                })
        };

        $scope.removeTypePanne = function(id){
            TypePanneProvider.remove(id).then(function(res) {
                    getAllTypesPanne();
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.createTypePanne = function(){
            TypePanneProvider.create($scope.newTypePanne).then(function(res){
                    getAllTypesPanne();
                })
                .catch(function(err){
                    console.log(err);
                })
        };


        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================
  }]);
