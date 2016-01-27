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
    'account.controllers',
    'provider',
    'storage',
    'satellizer',
    'LocalStorageModule',
    'ui.router'])

.run(function($ionicPlatform, $rootScope, $auth, Storage,$state) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function (event, next) {
        if (next.data != null) {
            var authenticationRequired = next.data.authenticationRequired;
            if (authenticationRequired && !$auth.isAuthenticated()) {
                event.preventDefault();
                $state.go("app");
            }
            if ($auth.isAuthenticated()) {
                var usersAuthorized = next.data.usersAuthorized;
                var isOk = false;
                if (usersAuthorized != null) {
                    var myRight = Storage.getStorage('user').data.user.right;
                    var log = [];
                    console.log(myRight);
                    angular.forEach(usersAuthorized, function (value, key) {
                        console.log(value);
                        if (value.toLowerCase() == myRight.toLowerCase()) {
                            isOk = true;
                        }

                    }, log);
                    console.log('isOk :' + isOk);
                    if (!isOk) {
                        event.preventDefault();
                    }
                }
            }
        }
    });

    $rootScope.myInterval;
    $rootScope.$on("stopInterval",function(event,data){
        clearInterval($rootScope.myInterval);
    });

    io.socket.on('truck',function(msg){
        switch(msg.verb){
            case "destroyed":
                $rootScope.$emit("truckDestroyed",{id:msg.id});
                break;
            case "updated":
                $rootScope.$emit("truckUpdated",{msg:msg.data})
                break;
        }
    })

    io.socket.on('panne',function(msg){
        switch(msg.verb){
            case "destroyed":
                $rootScope.$emit("panneDestroyed",{id:msg.id});
                break;
            case "updated":
                $rootScope.$emit("panneUpdated",{panne:msg.data.panne});
                break;
        }
    })
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
                'authenticationRequired' : true,
                'usersAuthorized' : ['Transporteur']
            }
        })

        .state('problems',{
            url:'/problems',
            templateUrl:'templates/problems.html',
            controller:"ProblemsCtrl",
            cache:false,
            data: {
              'authenticationRequired' : true
            }
        })

        .state('manageMenu', {
            url: '/manage_menu',
            templateUrl: 'templates/manage_menu.html',
            controller: "ManageCtrl",
            cache: false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire', 'Administrateur']
            }
        })

        .state("manageUsers",{
            url:"/manage_users",
            templateUrl:'templates/manage/users.html',
            controller:"ManageCtrl",
            cache: false,
            data: {
              'authenticationRequired' : true,
              'usersAuthorized' : ['Gestionnaire', 'Administrateur']
            }
        })

        .state("manageTrucks",{
            url:"/manage_trucks",
            templateUrl:'templates/manage/trucks.html',
            controller:"ManageCtrl",
            cache: false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire', 'Administrateur']
            }
        })

        .state("manageCompanys",{
            url:"/manage_companys",
            templateUrl:'templates/manage/companys.html',
            controller:"ManageCtrl",
            cache: false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire', 'Administrateur']
            }
        })

        .state("managePannes",{
            url:"/manage_pannes",
            templateUrl:'templates/manage/pannes.html',
            controller:"ManageCtrl",
            cache: false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire', 'Administrateur']
            }
        })

        .state("manageTypesPanne",{
            url:"/manage_typesPanne",
            templateUrl:'templates/manage/type_panne.html',
            controller:"ManageCtrl",
            cache: false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Administrateur']
            }
        })

        .state("homeGestionnaire",{
            url:"/home_gestionnaire",
            templateUrl:'templates/home_gestionnaire.html',
            controller:"HomeGestionnaireCtrl",
            cache:false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire']
            }
        })

        .state("homeRepairman",{
            url:"/home_repairman",
            templateUrl:'templates/home_repairman.html',
            controller:"HomeRepairmanCtrl",
            cache:false,
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Réparateur']
            }
        })

        .state("account",{
            url:"/account",
            templateUrl:'templates/account.html',
            controller:"AccountCtrl",
            cache:false,
            data: {
                'authenticationRequired' : true
            }
        })

        .state("manageMyCompany",{
            url:"/manage_company",
            templateUrl:"templates/manage/company.html",
            controller:"ManageCtrl",
            data: {
                'authenticationRequired' : true,
                'usersAuthorized' : ['Gestionnaire']
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

