/**
 * Created by Romain Gaillard on 20/01/2016.
 */

angular.module('home.controllers')


    .controller('HomeGestionnaireCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup','Storage','$rootScope','$auth','TruckProvider', function (
        $scope, $state,$cordovaGeolocation,$ionicPopup,Storage,$rootScope,$auth,TruckProvider) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.myUser = Storage.getStorage("user").data.user;
        $scope.vehicules = new Array();
        $scope.pannes = new Array();

        // ======== VARIABLES INTERNES ===============================
        var options = {timeout: 10000, enableHighAccuracy: true};
        var token = ""+Storage.getStorage("user").data.token;

        // ========= LES FONCTIONS INTERNES ============================

        var latLng;
        var getMap = function(trucks){
            $scope.vehicules = trucks;
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                //Wait until the map is loaded


                /* Faire une boucle sur  le nombre de vehicules */
                for(var i=0;i<$scope.vehicules.length;i++){
                    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: $scope.vehicules[i].location,
                            icon:"img/truck.svg"
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: $scope.vehicules[i].name,
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open($scope.map, marker);
                        });
                    });
                }

            }, function(error){
                console.log("Could not get location");
                getMap();
            });
        }

        var getPannes = function(){
            io.socket.get("http://localhost:1337/pannes/",{token:token},function(pannes,jwres){
                if(jwres.statusCode == 200){
                    console.log(pannes);
                    $scope.pannes = pannes;
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                }
            })
        }


        // ======== INITIALISATION ===================================
        TruckProvider.getAll_socket(getMap);
        //getPannes();
        //getMap();

        // ========= LES ROUTES ======================================

        $scope.goToProblems = function(){
            //$state.go("problems",{vehicule:$scope.vehicule},{reload:true});
        };
        // ========= LES FONCTIONS DU SCOPE ============================

        $scope.goToAdmin = function(){
            $state.go("manageMenu");
        }

        // ========= LES POPUPS ========================================


        // ========= LES EVENEMENTS ====================================


    }]);
