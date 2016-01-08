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

        var goToManageUsers = function () {
            $state.go("manageUsers");
        }
        var goToManageTrucks = function () {
            $state.go("manageTrucks");
        }
        var goToManagePannes = function () {
            $state.go("managePannes");
        }
        var goToManageTypesPanne = function () {
            $state.go("manageTypesPanne");
        }
        var goToManageRepairmans = function () {
            $state.go("manageRepairmans");
        }
        var goToManageCompanys = function () {
            $state.go("manageCompanys");
        }

        // ========= LES FONCTIONS DU SCOPE ============================

        // ========= LES FONCTIONS INTERNES ============================

        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }])
