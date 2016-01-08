/**
 * Created by Romain Gaillard on 08/01/2016.
 */

angular.module('manage.controllers',[])


    .controller('ManageCtrl', ['$scope', '$state','$rootScope', function ($scope, $state,$rootScope) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.users = {};

        // ======== INITIALISATION ===================================

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

        // ========= LES FONCTIONS INTERNES ============================

        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }])
