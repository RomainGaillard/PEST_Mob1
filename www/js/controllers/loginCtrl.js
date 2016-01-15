/*angular.module('login.controllers',['satellizer'])


.controller('LoginCtrl', ['$scope', '$state','$auth','$ionicPopup', function ($scope,$state, $auth, $ionicPopup) {

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
*/
/**
 * Created by damienp on 06/11/15.
 */

(function(){
  'use strict';

  angular
    .module('login.controllers',['satellizer'])
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$auth',
    '$ionicPopup',
    '$ionicHistory',
    'Storage'
  ];

  function LoginCtrl($rootScope, $scope, $state, $auth, $ionicPopup,$ionicHistory, Storage) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};

    if ($auth.isAuthenticated() && $ionicHistory.currentStateName() == "app" ){
      $state.go('home');
    }
    $scope.onLoginClick = function () {

      if (!$scope.myUser){
        popUp('Veuillez saisir vos identifiants.');
        return false;
      }
      $auth.login({email: angular.lowercase($scope.myUser.identifier), password:  $scope.myUser.password})
        .then(function (response) {
          $rootScope.authenticationRequired = true;
          Storage.setStorage('user', response);
          $state.go('home');
        })
        .catch(function (error) {
          popUp('Connexion impossible','Nom de compte ou mot de passe invalide.');
        })
      ;
    };

    $scope.onLogOutClick = function(){
      $rootScope.authenticationRequired = false;
      $auth.logout()
        .then(function(){
          Storage.clearStorage();
          $state.go('app');
        })
        .catch(function(response){
          popUp('Deconnexion Impossible', 'Un problème est survenu lors de la déconnexion')
        });
    };

    function popUp(title, subTitle) {
      var errorPop = $ionicPopup.show({
        template: '<p>',
        title: title,
        subTitle: subTitle,
        scope: $scope,
        buttons: [{ text: 'Ok' }]
      });
    }
  }
})();

