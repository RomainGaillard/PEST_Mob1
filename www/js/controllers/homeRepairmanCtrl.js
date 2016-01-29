/**
 * Created by Romain Gaillard on 20/01/2016.
 */

angular.module('home.controllers')


    .controller('HomeRepairmanCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup','Storage','$rootScope','$auth','TruckProvider', function (
        $scope, $state,$cordovaGeolocation,$ionicPopup,Storage,$rootScope,$auth,TruckProvider) {

        // ======== LES VARIABLES DU SCOPE ==========================
        $scope.myUser = Storage.getStorage("user").data.user;
        $scope.trucks = new Array();
        $scope.pannes = new Array();


        // ======== VARIABLES INTERNES ===============================
        var options = {timeout: 10000, enableHighAccuracy: true};
        var latLng;
        var marker;
        var markers = new Array();
        var freqEnvoi = 10000;
        var destination = "";

        // ========= LES FONCTIONS INTERNES ============================

        var determinerIcon = function(i){
            var icon = "pause";
            if($scope.trucks[i].running)
                icon =  "truck";

            switch($scope.trucks[i].state){
                case "En Panne":
                    var allPannesIntervention = true;
                    for(var j=0;j<$scope.trucks[i].pannes.length;j++){
                        if($scope.trucks[i].pannes[j].idRepairman == null)
                            allPannesIntervention = false;
                    }
                    if(allPannesIntervention  && $scope.trucks[i].pannes.length > 0)
                        icon = icon+"-blue";
                    else
                        icon = icon+"-red";
                    break;
                default: icon = icon+"-green";
                    break;
            }
            return icon;
        }

        var getAddress = function(i,pos,name){
            var geocoder = new google.maps.Geocoder();
            var nbPannes = "";
            if($scope.trucks[i].pannes)
                nbPannes = "<strong>"+$scope.trucks[i].pannes.length+" pannes en cours ! </strong><br>";
            geocoder.geocode({latLng: pos}, function(responses) {
                if (responses && responses.length > 0) {
                    var content = "<h5>"+name+"</h5>"+
                        "<div>"+nbPannes+
                        "" + responses[0].formatted_address +"</div>";
                    markers[i].infobulle.setContent(content);
                } else {
                    console.log('Error: Google Maps could not determine the address of this location.');
                }
            })
        }

        var getMyAddressLocation = function(){
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({latLng: latLng}, function(responses) {
                    if (responses && responses.length > 0) {
                        calculate(responses[0].formatted_address,destination);
                    } else {
                        console.log('Error: Google Maps could not determine the address of this location.');
                        getMyAddressLocation();
                    }
                })
            }, function(error){
                console.log("Could not get location");
                getMyAddressLocation();
            });
        }

        var getMap = function(trucks){
            getPannes(trucks);
            $scope.$apply(function () {
                $scope.trucks = trucks;
            });

            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                panel = document.getElementById("panel");

                direction = new google.maps.DirectionsRenderer({
                    map   : $scope.map,
                    panel : panel
                });
                //Wait until the map is loaded

                /* Faire une boucle sur  le nombre de vehicules */

                google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                    marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng,
                        icon:"img/vehicule.svg"
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: "Vous êtes ici",
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });

                    for(var i=0;i<$scope.trucks.length;i++) {
                        var jsonPos = JSON.parse($scope.trucks[i].location);
                        var pos = new google.maps.LatLng(jsonPos.lat, jsonPos.lng);
                        var name = $scope.trucks[i].name;

                        markers[i] = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: pos,
                            icon: "img/"+determinerIcon(i)+".svg"
                        });

                        var content = "<h5>"+name+"</h5>";
                        getAddress(i,pos,name);

                        markers[i].infobulle = new InfoBubble({
                            map: $scope.map,
                            content: content,
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
            $scope.$apply(function() {
                $scope.pannes = new Array();
                for (var i = 0; i < trucks.length; i++) {
                    for (var j = 0; j < trucks[i].pannes.length; j++) {
                        if (trucks[i].pannes[j]) {
                            $scope.pannes.push(trucks[i].pannes[j]);
                        }
                    }
                }
            })
        }

        var refreshTruck = function(i){
            var jsonPos = JSON.parse($scope.trucks[i].location);
            var pos = new google.maps.LatLng(jsonPos.lat, jsonPos.lng);
            var name = $scope.trucks[i].name;

            markers[i].setIcon("img/"+determinerIcon(i)+".svg")
            markers[i].setPosition(pos);
            getAddress(i,pos,name);
        }

        var startInterval = function(){
            if($rootScope.myInterval)
                clearInterval($rootScope.myInterval);
            $rootScope.myInterval = setInterval(updateLocation,freqEnvoi);
        }
        var updateLocation = function(){
            updateMap();
            if(latLng){
                TruckProvider.updateLocation(latLng);
            }
        }
        var updateMap = function(){
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                if(marker)
                    marker.setPosition(latLng);
            });
        }

        var calculate = function(origin, destination){
            if(origin && destination){
                var request = {
                    origin      : origin,
                    destination : destination,
                    travelMode  : google.maps.DirectionsTravelMode.DRIVING // Type de transport
                }
                var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
                directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
                    if(status == google.maps.DirectionsStatus.OK){
                        direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
                    }
                });
            }
        };

        // ======== INITIALISATION ===================================
        TruckProvider.getAll_socket(getMap);

        // ========= LES ROUTES ======================================

        $scope.goToProblems = function(){
            $state.go("problems",{reload:true});
        };
        $scope.goToAccount = function(){
            $state.go("account");
        };

        // ========= LES FONCTIONS DU SCOPE ============================

        $scope.traceIntineraire = function(dest){
            $state.go("homeRepairman");
            destination = dest;
            getMyAddressLocation();
        }


        // ========= LES POPUPS ========================================


        // ========= LES EVENEMENTS ====================================

        $rootScope.$on("truckUpdated", function (event,data) {
            for(var i=0;i<$scope.trucks.length;i++){
                if($scope.trucks[i].id == data.msg.truck.id){
                    $scope.$apply(function () {
                        $scope.trucks[i].company = data.msg.truck.company;
                        $scope.trucks[i].currentUser = data.msg.truck.currentUser;
                        $scope.trucks[i].location = data.msg.truck.location;
                        $scope.trucks[i].name = data.msg.truck.name;
                        $scope.trucks[i].running = data.msg.truck.running;
                        $scope.trucks[i].state = data.msg.truck.state;
                        if(data.msg.panne) {
                            $scope.trucks[i].pannes.push(data.msg.panne);
                            CompanyProvider.getTrucks(getPannes);
                        }
                        refreshTruck(i);
                    });
                }
            }
        });

        $rootScope.$on("panneDestroyed", function (event,data) {
            for(var i=0;i<$scope.trucks.length;i++){
                for(var j=0;j<$scope.trucks[i].pannes.length;j++){
                    if($scope.trucks[i].pannes[j].id == data.id){
                        $scope.$apply(function () {
                            $scope.trucks[i].pannes.splice(j,1);
                            refreshTruck(i);
                        });
                    }
                }
            }
            for(var k=0;k<$scope.pannes.length;k++){
                if($scope.pannes[k].id == data.id){
                    $scope.$apply(function(){
                        $scope.pannes.splice(k,1)
                    })
                }
            }
        });

        $rootScope.$on("panneUpdated",function(event,data){
            console.log(data);
            for(var i=0;i<$scope.trucks.length;i++){
                for(var j=0;j<$scope.trucks[i].pannes.length;j++){
                    if($scope.trucks[i].pannes[j].id == data.panne.id){
                        $scope.$apply(function () {
                            $scope.trucks[i].pannes[j] = data.panne;
                            refreshTruck(i);
                        });
                    }
                }
            }
            for(var k=0;k<$scope.pannes.length;k++){
                if($scope.pannes[k].id == data.panne.id){
                    $scope.$apply(function(){
                        $scope.pannes[k] = data.panne;
                    })
                }
            }
        })

        if($auth.isAuthenticated()&& Storage.getStorage("user").data.user.right == "Réparateur"){
            console.log("startInterval");
            startInterval();
        }
    }]);
