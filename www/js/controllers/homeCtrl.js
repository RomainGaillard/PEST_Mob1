angular.module('home.controllers',['ngCordova','LocalStorageModule'])


.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup','Storage','$rootScope','$auth', function (
    $scope, $state,$cordovaGeolocation,$ionicPopup,Storage,$rootScope,$auth) {

    // ======== LES VARIABLES DU SCOPE ==========================
    $scope.myUser = Storage.getStorage("user").data.user;
    $scope.vehicule = {};
    $scope.vehicule.etat = false;
    $scope.vehicule.problems = [];


    // ========= LES FONCTIONS INTERNES ============================

    var sendProblem = function(reason) {
        $scope.vehicule.problems.push(reason);
        //$('.problems').show();
    };

    var startInterval = function(){
        $rootScope.myInterval = setInterval(updateLocation,10000);
    }

    var latLng;
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

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon:"img/truck.svg"
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
    }

    function updateLocation() {
        console.log("envoi location");
        var token = ""+Storage.getStorage("user").data.token;
        console.log("token:"+token);
        var idTruck = ($scope.myUser.truck);
        console.log(idTruck);
        var loc = JSON.stringify(latLng);
        console.log("location:"+loc);

        io.socket.put("http://localhost:1337/truck/"+idTruck,{token:token,location:loc},function(truck,jwres){
            if(jwres.statusCode == 200){
                console.log(truck);
            }
            else{
                console.log(jwres.statusCode)
                console.log('Erreur'+jwres.body.err);
            }
        })
    }


    // ======== VARIABLES INTERNES ===============================
    var options = {timeout: 10000, enableHighAccuracy: true};

    // ======== INITIALISATION ===================================
    getMap();

    // ========= LES ROUTES ======================================

    $scope.goToProblems = function(){
        $state.go("problems",{vehicule:$scope.vehicule},{reload:true});
    };
    // ========= LES FONCTIONS DU SCOPE ============================

    // ========= LES POPUPS ========================================

    $scope.reportProblem = function() {
        $scope.data = {};
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
