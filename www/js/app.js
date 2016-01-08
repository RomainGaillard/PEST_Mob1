// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter',
  ['ionic',
    'login.controllers',
    'home.controllers',
    'problems.controllers',
    'manage.controllers',
    'users.services',
    'provider',
    'satellizer',
    'ui.router'])

.run(function($ionicPlatform, $rootScope, $auth) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authenticationRequired = next.data.authenticationRequired;
      if (authenticationRequired && !$auth.isAuthenticated()) {
        $state.go('app');
      }
    });
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '',
            cache: false,
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl',
            data: {
              'authenticationRequired' : false
            }
        })

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller:'HomeCtrl',
            data: {
              'authenticationRequired' : true
            }
        });

        /*.state('problems',{
            url:'/problems',
            templateUrl:'templates/problems.html',
            controller:"ProblemsCtrl",
            data: {
              'authenticationRequired' : true
            },
            params: {'vehicule':{etat:false,problems:[]}}
        })

        .state('manageMenu', {
            url: '/manage_menu',
            templateUrl: 'templates/manager_menu.html',
            controller: "ManageCtrl",
            data: {
              'authenticationRequired' : true
            }
        })

        .state("manageUsers",{
            url:"/manage_users",
            templateUrl:'templates/manage/users.html',
            controller:"ManageCtrl",
            data: {
              'authenticationRequired' : true
            }
        });*/

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/#');
});

