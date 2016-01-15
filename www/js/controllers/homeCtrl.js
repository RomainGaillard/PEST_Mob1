angular.module('home.controllers',['ngCordova'])


.controller('HomeCtrl', ['$scope', '$state','$cordovaGeolocation','$ionicPopup', 'TypePanneProvider', 'TruckProvider', 'PanneProvider', 'Storage',
  function ($scope, $state,$cordovaGeolocation,$ionicPopup, TypePanneProvider, TruckProvider,PanneProvider, Storage) {

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

}]);
