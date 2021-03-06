angular.module('problems.controllers',[])

    .controller('ProblemsCtrl', ['$scope', '$state','$ionicPopup','$ionicHistory', 'Storage', 'PanneProvider','$rootScope','TruckProvider','CompanyProvider','TypePanneProvider','UserProvider',
        function ($scope, $state,$ionicPopup,$ionicHistory, Storage, PanneProvider,$rootScope,TruckProvider,CompanyProvider,TypePanneProvider,UserProvider) {

        // ======== LES VARIABLES DU SCOPE ===========================
        $scope.myUser = Storage.getStorage("user").data.user;
        $scope.pannes = new Array();
        $scope.myClass = "Déclarée";

        // ======== VARIABLES INTERNES ===============================
        var trucks = new Array();
        var typesPanne = new Array();

        // ========= LES ROUTES ======================================

        $scope.goToHome = function () {
            $ionicHistory.goBack();
        };


        // ========= LES FONCTIONS DU SCOPE ==========================

        $scope.cancelProblem = function(panne){
            PanneProvider.remove(panne.id)
                .then(function(response){
                    //$scope.splice($scope.pannes.indexOf(panne),1);
                    //Storage.setStorage("pannes",$scope.pannes);
                    console.log(response);
                }).catch(function(error){
                console.log(error);
            })
        };

        $scope.getTypePanne = function(id){
            for(var i=0;i<typesPanne.length;i++){
                if(typesPanne[i].id == id){
                    return typesPanne[i].name;
                }
            }
        }

        $scope.intervenir = function(index){
            var test = {};
            test.id = $scope.pannes[index].id;


            if($scope.pannes[index].state == "Déclarée"){
                $scope.pannes[index].state = "En cours";
                test.idRepairman = $scope.myUser.id;
            }
            else {
                $scope.pannes[index].state = "Déclarée";
                test.idRepairman = null;
            }


            test.state = $scope.pannes[index].state;


            PanneProvider.update(test.id,test)
                .then(function(res){
                    console.log(res);
                })
                .catch(function(err){
                    console.log(err);
                })
        }

        $scope.getUser = function(id){
            console.log(id);
            /*UserProvider.getOne(id).then(function(res){
                var nom = res.firstname + " "+ res.lastname;
                return nom;
            })
            .catch(function(err){
                console.log(err);
            })*/
        }

        // ========= LES FONCTIONS INTERNES ==========================

        function getPannes(){
            if($scope.myUser.right == "Transporteur"){
                TruckProvider.getOne($scope.myUser.truck, function(res){
                    $scope.$apply(function(){
                        for(var j=0;j<res.pannes.length;j++){
                            var p = res.pannes[j];
                            p.truckName = res.name;
                            $scope.pannes.push(p);
                            trucks.push(res);
                            formatDate($scope.pannes.length-1);
                        }
                    });
                })
            }
            else if($scope.myUser.right == "Gestionnaire"){
                CompanyProvider.getTrucks(function(trucks_){
                    for(var i=0;i<trucks_.length;i++){
                        if(trucks_[i].length == undefined) {  //  CORRIGER BUG WTF DE LA MORT QUI TUE !
                            trucks.push(trucks_[i]);
                            for (var j = 0; j < trucks_[i].pannes.length; j++) {
                                var p = trucks_[i].pannes[j];
                                p.truckName = trucks_[i].name;
                                geocoder(p, trucks_[i].location);
                            }
                        }
                    }
                });
            }
            else if($scope.myUser.right == "Réparateur"){
                TruckProvider.getAll_socket(function(trucks_){
                    for(var i=0;i<trucks_.length;i++){
                        if(trucks_[i].length == undefined) {  //  CORRIGER BUG WTF DE LA MORT QUI TUE !
                            trucks.push(trucks_[i]);
                            for (var j = 0; j < trucks_[i].pannes.length; j++) {
                                var p = trucks_[i].pannes[j];
                                p.truckName = trucks_[i].name;
                                geocoder(p, trucks_[i].location);
                            }
                        }
                    }
                })
            }
        }

        var geocoder = function(p,location){
            var jsonPos = JSON.parse(location);
            var pos = new google.maps.LatLng(jsonPos.lat, jsonPos.lng);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({latLng: pos}, function(responses,err) {
                if (responses && responses.length > 0) {
                    p.address = responses[0].formatted_address;
                } else {
                    console.log('Error: Google Maps could not determine the address of this location.'+err);
                }
                $scope.$apply(function(){
                    $scope.pannes.push(p);
                    formatDate($scope.pannes.length-1);
                })
            })
        }

        function formatDate(index){
            var date = new Date($scope.pannes[index].createdAt);
            var h = date.getHours();
            var m = date.getMinutes();
            var j = date.getDate();
            $scope.pannes[index].createdAt = "le "+j+" à "+h+"h"+m;
        }

        var getAllTypesPanne = function(){
                TypePanneProvider.getAll()
                    .then(function(res){
                        typesPanne = res;
                    })
                    .catch(function(err){
                        console.log(err);
                    });
        };


        // ======== INITIALISATION ===================================
        getAllTypesPanne();
        getPannes();

        // ========= LES POPUPS ======================================

        // ========= LES EVENEMENTS ==================================

        $rootScope.$on("panneDestroyed", function (event,data) {
            console.log("panneDestroyed");
            for(var i=0;i<$scope.pannes.length;i++){
                if($scope.pannes[i].id == data.id){
                    $scope.$apply(function () {
                        $scope.pannes.splice(i,1);
                    });
                }
            }
        });

        $rootScope.$on("truckUpdated", function (event,data) {
            console.log(trucks);
            for(var i=0;i<trucks.length;i++){
                if(trucks[i].id == data.msg.truck.id){
                    $scope.$apply(function () {
                        trucks[i] = data.msg.truck;
                        trucks[i].company = data.msg.truck.company;
                        trucks[i].currentUser = data.msg.truck.currentUser;
                        trucks[i].location = data.msg.truck.location;
                        trucks[i].name = data.msg.truck.name;
                        trucks[i].running = data.msg.truck.running;
                        trucks[i].state = data.msg.truck.state;
                        if(data.msg.panne) {
                            trucks[i].pannes.push(data.msg.panne);
                            if($scope.myUser.right == "Transporteur"){
                                $scope.pannes.push(data.msg.panne);
                                formatDate($scope.pannes.length-1);
                            }
                        }
                    });
                    // Le scope APPLY est déjà dans le geocoder !
                    if(data.msg.panne && $scope.myUser.right == "Gestionnaire"){
                        var p = trucks[i].pannes[trucks[i].pannes.length-1];
                        p.truckName = trucks[i].name;
                        geocoder(p,trucks[i].location);
                    }
                }
            }
        });

        $rootScope.$on("panneUpdated", function(event,data){
            for(var i=0;i<$scope.pannes.length;i++){
                if($scope.pannes[i].id == data.panne.id){
                    $scope.$apply(function(){
                        $scope.pannes[i].state = data.panne.state;
                        console.log(data.panne.state);
                        if(data.panne.state == "En cours")
                            $(".panne"+data.panne.id).switchClass("Déclarée","EnCours",500);
                        else
                            $(".panne"+data.panne.id).switchClass("EnCours","Déclarée",500);
                    })
                }
            }
        })

    }]);
