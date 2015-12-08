angular.module('home.controllers',[])


.controller('HomeCtrl', ['$scope', '$state', function ($scope, $state) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};
    $scope.myUser.name = "pseudo"

    // ======== INITIALISATION ===================================


    // ======== VARIABLES INTERNES ===============================

    // ========= LES ROUTES ======================================

    $scope.goToHome = function () {
        $state.go("home");
    }

    // ========= LES FONCTIONS DU SCOPE ============================

    // ========= LES FONCTIONS INTERNES ============================

    // ========= LES POPUPS ========================================

    // ========= LES EVENEMENTS ====================================

}])
