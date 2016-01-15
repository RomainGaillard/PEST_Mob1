/**
 * Created by Romain Gaillard on 08/01/2016.
 */

/*angular.module('manage.controllers',[])


    .controller('ManageCtrl', ['$scope', '$state','UserProvider', function ($scope, $state, UserProvider) {*/
(function() {
  'use strict';

  angular
    .module('manage.controllers', [])
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = [
    'UserProvider'
  ];
  function ManageCtrl(UserProvider) {
    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.users = UserProvider.getAll()
      .then(function (res) {
        return res;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
})();
        /*// ======== INITIALISATION ===================================

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
        $scope.goToManageRepairmans = function () {
            $state.go("manageRepairmans");
        };
        $scope.goToManageCompanys = function () {
            $state.go("manageCompanys");
        };
        $scope.goToBack = function(){
            $state.go("manageMenu");
        };

        // ========= LES FONCTIONS DU SCOPE ============================

        // ========= LES FONCTIONS INTERNES ============================

        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================
*/
  //}]);
