﻿/*angular.module('login.controllers',['satellizer'])


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
    '$ionicHistory'
  ];

  function LoginCtrl($rootScope, $scope, $state, $auth, $ionicPopup,$ionicHistory) {

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
          $state.go('home');
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

