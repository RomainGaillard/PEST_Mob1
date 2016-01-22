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
    '$ionicHistory',
    'Storage'
  ];

  function LoginCtrl($rootScope, $scope, $state, $auth, $ionicPopup,$ionicHistory, Storage) {

    // ======== LES VARIABLES INTERNES =========================
      var finVerif = true;

    // ======== LES FONCTIONS INTERNES ==========================
    function goToHome(){
      console.log(Storage.getStorage("user").data.user.right);
      switch(Storage.getStorage("user").data.user.right){
        case "Utilisateur": $state.go("home",{},{reload:true});
              break;
        case "Administrateur":
              $state.go("manageMenu");
              break;
          case "Gestionnaire":
              $state.go("homeGestionnaire");
              break;
        default:
              $state.go("home",{},{reload:true});
              break;
      }
    }

      var showError = function(msgError){
          if(finVerif){
              finVerif = false;
              $scope.msgBtConnexion = msgError;
              $("[id='successCo']").fadeOut("fast",function(){
                  $("[id='errorCo']").fadeIn("fast");
              });

              $("[id='btConnexion']").switchClass("button-balanced","button-assertive","fast","easeInQuart",function() {
                  $("[id='btConnexion']").delay(1500).switchClass("button-assertive", "button-balanced", "fast", "easeInQuart",function(){
                      $("[id='errorCo']").fadeOut("fast",function(){
                          $("[id='successCo']").fadeIn("fast");
                          finVerif = true;
                      });
                  })
              })
          }
      };
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
          goToHome();
        })
        .catch(function (error) {
            if(error.data.err.indexOf("required")>=0){
                showError("Veuillez remplir tous les champs !")
            }
            else if(error.data.err.indexOf("invalid")>=0)
                showError("Mot de passe ou email invalide !");
            else
                showError("Erreur connexion serveur:"+error.status);
          console.log(error);
        })
      ;
    };

    $scope.onLogOutClick = function(){
      $rootScope.authenticationRequired = false;
      $rootScope.$emit("stopInterval");
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

    // ================= INITIALISATION =======================
      $("#errorCo").hide();
  }
})();

