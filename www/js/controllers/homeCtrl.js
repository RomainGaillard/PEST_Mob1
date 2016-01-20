angular.module('home.controllers',['ngCordova','LocalStorageModule'])


<<<<<<< HEAD
.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', 'TypePanneProvider', 'TruckProvider', 'PanneProvider', 'Storage',
  function ($scope, $state,$cordovaGeolocation,$ionicPopup, TypePanneProvider, TruckProvider,PanneProvider, Storage) {
=======
.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup','Storage','$rootScope','$auth', function (
    $scope, $state,$cordovaGeolocation,$ionicPopup,Storage,$rootScope,$auth) {
>>>>>>> 3c859b07aad7e9bbf05732409cb79016967d7ad1

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


    TruckProvider.getOne(Storage.getStorage('user').data.user.truck)
      .then(function(response){
        $scope.vehicule.problems = response.pannes;
      }).catch(function(error){

    });

    // ========= LES ROUTES ======================================

    $scope.goToProblems = function(){
        $state.go("problems",{vehicule:$scope.vehicule},{reload:true});
    };
    // ========= LES FONCTIONS DU SCOPE ============================

<<<<<<< HEAD
    // ========= LES FONCTIONS INTERNES ============================

    var sendProblem = function(newPanne) {
      console.log(newPanne);
      newPanne.truck = Storage.getStorage('user').data.user.truck;
      PanneProvider.create(newPanne)
        .then(function(response){
        TruckProvider.getOne(Storage.getStorage('user').data.user.truck)
          .then(function(response){
            $scope.vehicule.problems = response.pannes;
            console.log($scope.vehicule.problems);
          }).catch(function(error){

        });
      }).catch(function(error){

      });

        //$scope.vehicule.problems.push(reason);
        //$('.problems').show();
    };

=======
>>>>>>> 3c859b07aad7e9bbf05732409cb79016967d7ad1
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
