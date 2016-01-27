angular.module('home.controllers')

    .controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', 'TypePanneProvider', 'TruckProvider', 'PanneProvider', 'Storage','$rootScope','$auth',
        function ($scope, $state,$cordovaGeolocation,$ionicPopup, TypePanneProvider, TruckProvider,PanneProvider, Storage,$rootScope,$auth) {

            // ======== LES VARIABLES DU SCOPE ==========================
            $scope.myUser = Storage.getStorage("user").data.user;
            $scope.truck = {};


            // ======== VARIABLES INTERNES ===============================
            var options = {timeout: 10000, enableHighAccuracy: true};
            var mesPositions = new Array();
            var latLng;
            var marker;
            var inactif = false;
            var freqEnvoi = 15000;
            var freqInactif = 12;

            // ========= LES FONCTIONS INTERNES ============================

            var determinerIcon = function(){
                var icon = "pause";
                if($scope.truck.running)
                    icon =  "truck";

                switch($scope.truck.state){
                    case "En Panne":
                        console.log($scope.truck.pannes)
                        var allPannesIntervention = true;
                        for(var j=0;j<$scope.truck.pannes.length;j++){
                            if($scope.truck.pannes[j].idRepairman == null)
                                allPannesIntervention = false;
                        }
                        if(allPannesIntervention)
                            icon = icon+"-blue";
                        else
                            icon = icon+"-red";
                        break;
                    default: icon = icon+"-green";
                        break;
                }
                return icon;
            }

            var alertInactif = function(){
                if(!inactif){
                    inactif = true;
                    $scope.truck.running = false;
                    $scope.updateRunning();
                    //popUp("Attention","Vous êtes inactif ?","Non")
                    var myPopup = $ionicPopup.show({
                        template: "Etes-vous entrain de rouler ?",
                        title: "Avertissement",
                        cssClass:"popupReportProblem",
                        subTitle: 'Vous ne bougez-plus...',
                        scope: $scope,
                        controller: 'HomeCtrl',
                        buttons: [
                            { text: 'Non' },
                            {
                                text: '<b>Oui</b>',
                                type: 'button-assertive',
                                onTap: function(e) {
                                    inactif = false;
                                    $scope.truck.running = true;
                                    $scope.updateRunning();
                                }
                            }
                        ]
                    });
                }
            }

            var startInterval = function(){
                if($rootScope.myInterval)
                    clearInterval($rootScope.myInterval);
                $rootScope.myInterval = setInterval(updateLocation,freqEnvoi);
            }
            var updateLocation = function(){
                updateMap();
                if(latLng){
                    var posActu = latLng.toJSON();
                    posActu.lat = posActu.lat.toFixed(5);
                    posActu.lng = posActu.lng.toFixed(5);
                    mesPositions.push(posActu);
                    console.log(mesPositions.length);
                    if(mesPositions.length > freqInactif){  // Inactif au bout de 120 secondes.
                        if(mesPositions[0].lat == mesPositions[mesPositions.length-1].lat && mesPositions[0].lng == mesPositions[mesPositions.length-1].lng) {
                            if($scope.truck.running)
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
                            icon:"img/"+determinerIcon()+".svg"
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
                    PanneProvider.create(newPanne, function(res){
                        console.log(res);
                        $scope.$apply(function(){
                            $scope.truck.pannes.push(res.created.pannes);
                        })
                    });
                }
                else console.log("Vous n'avez pas de camion associé.");
            };

            var getMyTruck = function(){
                console.log("getMyTruck");
                TruckProvider.getOne($scope.myUser.truck, function(res){
                    $scope.$apply(function(){
                        console.log(res);
                        $scope.truck = res;
                        $scope.truck.pannes = res.pannes;
                    });
                })
            }

            function popUp(title, subTitle,txtBt) {
                var errorPop = $ionicPopup.show({
                    template: '<p>',
                    title: title,
                    subTitle: subTitle,
                    scope: $scope,
                    buttons: [{ text: txtBt }]
                });
            }

            var refreshTruck = function(){
                var jsonPos = JSON.parse($scope.truck.location);
                var pos = new google.maps.LatLng(jsonPos.lat, jsonPos.lng);

                marker.setIcon("img/"+determinerIcon()+".svg")
                marker.setPosition(pos);
            }


            // ======== INITIALISATION ===================================
            getMyTruck();
            getMap();
            //getMyPannes();


            // ========= LES ROUTES ======================================

            $scope.goToProblems = function(){
                $state.go("problems",{reload:true});
            };
            $scope.goToAccount = function(){
                $state.go("account");
            };

            // ========= LES FONCTIONS DU SCOPE ============================

            $scope.updateRunning = function(){
                marker.setIcon("img/"+determinerIcon()+".svg");
                TruckProvider.update($scope.truck.id,$scope.truck);
            }

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
                                        sendProblem($scope.newPanne);
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

            $rootScope.$on("panneDestroyed", function (event,data) {
                for(var i=0;i<$scope.truck.pannes.length;i++){
                    if($scope.truck.pannes[i].id == data.id){
                        $scope.$apply(function () {
                            $scope.truck.pannes.splice(i,1);
                        });
                    }
                }
            });

            $rootScope.$on("panneUpdated", function (event,data) {
                console.log(data);
                for(var i=0;i<$scope.truck.pannes.length;i++){
                    if($scope.truck.pannes[i].id == data.panne.id){
                        $scope.$apply(function(){
                            $scope.truck.pannes[i] = data.panne;
                            refreshTruck();
                        })
                    }
                }
                // Editer nombre de panne + icon !
            });

            $rootScope.$on("truckUpdated",function(event,data){
                console.log(data);
                $scope.$apply(function(){
                    var pannes = $scope.truck.pannes;
                    $scope.truck = data.msg.truck;
                    $scope.truck.pannes = pannes;
                    refreshTruck();
                })
                // Editer si perte du truck / currentUser !
            })

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
