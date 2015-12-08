angular.module('login.controllers',[])


.controller('LoginCtrl', ['$scope', '$state','$rootScope', function ($scope, $state,$rootScope) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};
    $scope.myUser.identifier = "";
    $scope.myUser.password = "";
    $scope.msgBtConnexion = "";

    // ======== INITIALISATION ===================================
    $("[id='errorCo']").hide();

    // ======== VARIABLES INTERNES ===============================

    // ========= LES ROUTES ======================================

    var goToHome = function () {
        $state.go("home");
    }

    // ========= LES FONCTIONS DU SCOPE ============================

    $scope.doLogin = function(){
        goToHome();
    }

    $rootScope.logout = function(){
        $state.go("app");
    }
    // ========= LES FONCTIONS INTERNES ============================

    // ========= LES POPUPS ========================================

    // ========= LES EVENEMENTS ====================================
    
}])
