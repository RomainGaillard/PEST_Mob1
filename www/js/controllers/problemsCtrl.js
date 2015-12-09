angular.module('problems.controllers',[])

    .controller('ProblemsCtrl', ['$scope', '$state','$ionicPopup','$stateParams','$ionicHistory', function ($scope, $state,$ionicPopup,$stateParams,$ionicHistory) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.vehicule = $stateParams.vehicule;
        if($scope.vehicule.problems.length <= 0)
            $state.go("home");

        // ======== VARIABLES INTERNES ===============================

        // ======== INITIALISATION ===================================

        // ========= LES ROUTES ======================================

        $scope.goToHome = function () {
            $state.go("home",{},{reload:false});
        }

        // ========= LES FONCTIONS DU SCOPE ============================

        // ========= LES FONCTIONS INTERNES ============================


        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }])
