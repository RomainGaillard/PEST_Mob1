// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('provider',['restangular','LocalStorageModule']);
angular.module('home.controllers',['ngCordova','LocalStorageModule']);

angular.module('starter',
  ['ionic',
    'login.controllers',
    'home.controllers',
    'problems.controllers',
    'manage.controllers',
    'provider',
    'storage',
    'satellizer',
    'LocalStorageModule',
    'ui.router'])

.run(function($ionicPlatform, $rootScope, $auth, Storage) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        //$auth.setStorageType('sessionStorage');
    });

    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authenticationRequired = next.data.authenticationRequired;
        if (authenticationRequired && !$auth.isAuthenticated()) {
            event.preventDefault();
        }
    });


    $rootScope.myInterval;
    $rootScope.$on("stopInterval",function(event,data){
        clearInterval($rootScope.myInterval);
    });
})
.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setStorageType('sessionStorage');
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
            cache:false,
            data: {
              'authenticationRequired' : true
            }
        })

        .state('problems',{
            url:'/problems',
            templateUrl:'templates/problems.html',
            controller:"ProblemsCtrl",
            data: {
              'authenticationRequired' : true,
              'vehicule':{etat:false,problems:[]}
            }
        })

        .state('manageMenu', {
            url: '/manage_menu',
            templateUrl: 'templates/manage_menu.html',
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
        })

        .state("manageTrucks",{
            url:"/manage_trucks",
            templateUrl:'templates/manage/trucks.html',
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true
            }
        })

        .state("manageCompanys",{
            url:"/manage_companys",
            templateUrl:'templates/manage/companys.html',
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true
            }
        })

        .state("managePannes",{
            url:"/manage_pannes",
            templateUrl:'templates/manage/pannes.html',
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true
            }
        })

        .state("manageTypesPanne",{
            url:"/manage_typesPanne",
            templateUrl:'templates/manage/type_panne.html',
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true
            }
        })

        .state("manageRepairmans",{
            url:"/manage_repairmans",
            templateUrl:'templates/manage/repairmans.html',
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true
            }
        })

        .state("homeGestionnaire",{
            url:"/home_gestionnaire",
            templateUrl:'templates/home_gestionnaire.html',
            controller:"HomeGestionnaireCtrl",
            data: {
                'authenticationRequired' : true
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

