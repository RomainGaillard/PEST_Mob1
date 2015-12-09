angular.module('home.controllers',['ngCordova'])


.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', function ($scope, $state,$cordovaGeolocation,$ionicPopup) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};
    $scope.myUser.name = "pseudo";
    $scope.vehicule = {};
    $scope.vehicule.etat = false;
    $scope.vehicule.problems = [];

    // ======== VARIABLES INTERNES ===============================
    var options = {timeout: 10000, enableHighAccuracy: true};

    // ======== INITIALISATION ===================================
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });
        });

    }, function(error){
        console.log("Could not get location");
    });

    // ========= LES ROUTES ======================================

    $scope.goToProblems = function(){
        $state.go("problems",{vehicule:$scope.vehicule},{reload:true});
    }
    // ========= LES FONCTIONS DU SCOPE ============================

    // ========= LES FONCTIONS INTERNES ============================

    var sendProblem = function(reason) {
        $scope.vehicule.problems.push(reason);
        //$('.problems').show();
    }

    // ========= LES POPUPS ========================================

    $scope.reportProblem = function() {
        $scope.data = {}
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<textarea ng-model="data.reason" rows="3" ></textarea>',
            title: "Signalement d'un problème",
            cssClass:"popupReportProblem",
            subTitle: 'Indiquer votre problème',
            scope: $scope,
            buttons: [
                { text: 'Annuler' },
                {
                    text: '<b>Envoyer</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        if ($scope.data.reason == undefined || $scope.data.reason == "") {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            sendProblem($scope.data.reason);
                        }
                    }
                }
            ]
        });
    };

    // ========= LES EVENEMENTS ====================================

}])
