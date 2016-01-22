/**
 * Created by Romain Gaillard on 20/01/2016.
 */

angular.module('home.controllers')


    .controller('HomeGestionnaireCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup','Storage','$rootScope','$auth','CompanyProvider', function (
        $scope, $state,$cordovaGeolocation,$ionicPopup,Storage,$rootScope,$auth,CompanyProvider) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.myUser = Storage.getStorage("user").data.user;
        $scope.vehicules = new Array();
        $scope.pannes = new Array();


        // ======== VARIABLES INTERNES ===============================
        var options = {timeout: 10000, enableHighAccuracy: true};
        var token = ""+Storage.getStorage("user").data.token;
        var latLng;
        var markers = new Array();
        var infoWindow = new Array();
        // ========= LES FONCTIONS INTERNES ============================

        var getMap = function(trucks){
            getPannes(trucks);
            $scope.$apply(function () {
                $scope.vehicules = trucks;
            });
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

                google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                    for(var i=0;i<$scope.vehicules.length;i++) {
                        var jsonPos = JSON.parse($scope.vehicules[i].location);
                        var pos = new google.maps.LatLng(jsonPos.lat, jsonPos.lng);
                        var name = $scope.vehicules[i].name;
                        var icon = "truck-green";
                        switch($scope.vehicules[i].state){
                            case "En Panne":icon = "truck-red";
                                break;
                        }
                        markers[i] = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: pos,
                            icon: "img/"+icon+".svg"
                        });

                        markers[i].infobulle = new InfoBubble({
                            map: $scope.map,
                            content: name,
                            position: pos,  // Coordonnées latitude longitude du marker
                            shadowStyle: 0,  // Style de l'ombre de l'infobulle (0, 1 ou 2)
                            padding: 0,  // Marge interne de l'infobulle (en px)
                            backgroundColor: '#7EC587',  // Couleur de fond de l'infobulle
                            borderRadius: 10, // Angle d'arrondis de la bordure
                            arrowSize: 10, // Taille du pointeur sous l'infobulle
                            borderWidth: 2,  // Épaisseur de la bordure (en px)
                            borderColor: '#269835', // Couleur de la bordure
                            hideCloseButton: true, // Cacher le bouton 'Fermer'
                            arrowPosition: 50,  // Position du pointeur de l'infobulle (en %)
                            arrowStyle: 0,  // Type de pointeur (0, 1 ou 2)
                            disableAnimation: false,  // Déactiver l'animation à l'ouverture de l'infobulle
                            maxWidth:200,
                            minHeight:30,
                            disableAutoPan:true
                        });

                        markers[i].isOpen = false;
                        google.maps.event.addListener(markers[i], 'click', function() {
                            if(!this.isOpen)
                                this.infobulle.open();
                            else
                                this.infobulle.close();
                            this.isOpen = !this.isOpen;

                        });



                        /*infoWindow.push(new google.maps.InfoWindow({
                            content: name
                        }));

                        google.maps.event.addListener(markers[i], 'click', function (i) {
                            infoWindow[i].open($scope.map, markers[i]);
                        });*/
                    }
                });

            }, function(error){
                console.log("Could not get location");
                getMap();
            });
        }

        var getPannes = function(trucks){
            for(var i=0;i<trucks.length;i++){
                $scope.$apply(function () {
                    if(trucks[i].pannes.length > 0){
                        $scope.pannes.push(trucks[i].pannes);
                        console.log($scope.pannes);
                    }
                });
            }
        }
        // ======== INITIALISATION ===================================
        CompanyProvider.getTrucks(getMap);

        // ========= LES ROUTES ======================================

        $scope.goToProblems = function(){
            //$state.go("problems",{vehicule:$scope.vehicule},{reload:true});
        };
        // ========= LES FONCTIONS DU SCOPE ============================

        $scope.goToAdmin = function(){
            $state.go("manageMenu");
        }

        $scope.goToProblems = function(){
            $state.go("problems",{panne:$scope.pannes},{reload:true});
        }
        // ========= LES POPUPS ========================================


        // ========= LES EVENEMENTS ====================================


    }]);
