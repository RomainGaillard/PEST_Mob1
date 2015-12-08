angular.module('home.controllers',['ngCordova'])


.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', function ($scope, $state,$cordovaGeolocation,$ionicPopup) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = {};
    $scope.myUser.name = "pseudo"

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

    $scope.goToHome = function () {
        $state.go("home");
    }

    // ========= LES FONCTIONS DU SCOPE ============================

    // ========= LES FONCTIONS INTERNES ============================

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
                        if (!$scope.data.wifi) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
    };

    // ========= LES EVENEMENTS ====================================

}])
