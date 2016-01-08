/*angular.module('login.controllers',[])


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

}])*/

/**
 * Created by damienp on 06/11/15.
 */
(function(){
  'use strict';

  angular
    .module('login.controllers',['satellizer'])
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$auth',
    '$ionicPopup'
  ];

  function LoginController($rootScope, $scope, $state, $auth, $ionicPopup) {
    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};

    if ($auth.isAuthenticated()){
      $state.go('app.home');
    }
    $scope.onLoginClick = function () {

      if (!$scope.myUser){
        popUp('Veuillez saisir vos identifiants.');
        return false;
      }
      $auth.login({email: angular.lowercase($scope.myUser.identifier), password:  $scope.myUser.password})
        .then(function (response) {
          $rootScope.authenticationRequired = true;
          $state.go('app.home');
        })
        .catch(function (error) {
          popUp('Nom de compte ou mot de passe invalide.');
        })
      ;
    };

    function popUp(subTitle) {
      var errorPop = $ionicPopup.show({
        template: '<p>',
        title: 'Connexion impossible',
        subTitle: subTitle,
        scope: $scope,
        buttons: [{ text: 'Ok' }]
      });
    }
  }

})();

