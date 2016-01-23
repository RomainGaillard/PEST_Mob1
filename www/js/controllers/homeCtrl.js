angular.module('home.controllers')

    .controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', 'TypePanneProvider', 'TruckProvider', 'PanneProvider', 'Storage','$rootScope','$auth',
        function ($scope, $state,$cordovaGeolocation,$ionicPopup, TypePanneProvider, TruckProvider,PanneProvider, Storage,$rootScope,$auth) {

            // ======== LES VARIABLES DU SCOPE ==========================
            $scope.myUser = Storage.getStorage("user").data.user;
            $scope.vehicule = {};
            $scope.vehicule.etat = false;
            $scope.vehicule.problems = [];


            // ======== VARIABLES INTERNES ===============================
            var options = {timeout: 10000, enableHighAccuracy: true};
            var mesPositions = new Array();
            var latLng;
            var marker;

            // ========= LES FONCTIONS INTERNES ============================

            var alertInactif = function(){
                popUp("Attention","Vous êtes inactif ?","Non")
            }
            var startInterval = function(){
                if($rootScope.myInterval)
                    clearInterval($rootScope.myInterval);
                $rootScope.myInterval = setInterval(updateLocation,9000);
            }
            var updateLocation = function(){
                updateMap();
                if(latLng){
                    var posActu = latLng.toJSON();
                    posActu.lat = posActu.lat.toFixed(5);
                    posActu.lng = posActu.lng.toFixed(5);
                    mesPositions.push(posActu);
                    console.log(mesPositions.length);
                    if(mesPositions.length > 12){  // Inactif au bout de 120 secondes.
                        if(mesPositions[0].lat == mesPositions[mesPositions.length-1].lat && mesPositions[0].lng == mesPositions[mesPositions.length-1].lng) {
                            alertInactif();
                            mesPositions = new Array();
                        }
                    }
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
            var getMap = function(){
                $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    //Wait until the map is loaded
                    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                        marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: latLng,
                            icon:"img/truck-red.svg"
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: "Vous êtes ici",
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open($scope.map, marker);
                        });
                    });

                }, function(error){
                    console.log("Could not get location");
                    getMap();
                });
            };
            var sendProblem = function(newPanne) {
                newPanne.truck = Storage.getStorage('user').data.user.truck;
                if (newPanne.truck != null) {

                    PanneProvider.create(newPanne)
                        .then(function (response) {
                            TruckProvider.getOne(Storage.getStorage('user').data.user.truck)
                                .then(function (response) {
                                    $scope.vehicule.problems = response.pannes;
                                    savePannes(response);
                                    console.log($scope.vehicule.problems);
                                }).catch(function (error) {

                            });
                        }).catch(function (error) {

                    });
                } else console.log("Vous n'avez pas de camion associé.");
            };

            function popUp(title, subTitle,txtBt) {
                if(errorPop)
                    errorPop.close();
                var errorPop = $ionicPopup.show({
                    template: '<p>',
                    title: title,
                    subTitle: subTitle,
                    scope: $scope,
                    buttons: [{ text: txtBt }]
                });
            }

            var getMyPannes = function(){
                TruckProvider.getOne(Storage.getStorage('user').data.user.truck)
                    .then(function(response){
                        $scope.vehicule.problems = response.pannes;
                        savePannes(response);
                    }).catch(function(error){

                });
            }

            var savePannes = function(response){
                var pannes = response.pannes;
                for(var i=0;i<pannes.length;i++){
                    pannes[i].truckName = response.name;
                }
                Storage.setStorage('pannes', pannes);
            }

            // ======== INITIALISATION ===================================
            getMap();
            getMyPannes();


            // ========= LES ROUTES ======================================

            $scope.goToProblems = function(){
                $state.go("problems",{reload:true});
            };
            // ========= LES FONCTIONS DU SCOPE ============================


            // ========= LES POPUPS ========================================

            $scope.reportProblem = function() {
                $scope.newPanne = {};
                $scope.listTypePanne = {};
                TypePanneProvider.getAll()
                    .then(function(response){
                        $scope.listTypePanne = response;
                        var myPopup = $ionicPopup.show({
                            templateUrl: "templates/formulaires/sendPanne.html",
                            title: "Signalement d'un problème",
                            cssClass:"popupReportProblem",
                            subTitle: 'Indiquer votre problème',
                            scope: $scope,
                            controller: 'HomeCtrl',
                            buttons: [
                                { text: 'Annuler' },
                                {
                                    text: '<b>Envoyer</b>',
                                    type: 'button-assertive',
                                    onTap: function(e) {
                                        console.log($scope.newPanne.comment);
                                        if ($scope.newPanne.comment == undefined || $scope.newPanne.comment == "") {
                                            e.preventDefault();
                                        } else {
                                            console.log($scope.newPanne);
                                            sendProblem($scope.newPanne);
                                        }
                                    }
                                }
                            ]
                        });
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            };

            // ========= LES EVENEMENTS ====================================


            $rootScope.$on("$stateChangeSuccess",function(event,next){
                if($auth.isAuthenticated() && Storage.getStorage("user").data.user.right == "Transporteur"){
                    console.log("startInterval");
                    startInterval();
                }
            })

            // En cas de chargement de la page sans passer par le $stageChange.
            if($auth.isAuthenticated()&& Storage.getStorage("user").data.user.right == "Transporteur"){
                console.log("startInterval");
                startInterval();

            }


        }]);
