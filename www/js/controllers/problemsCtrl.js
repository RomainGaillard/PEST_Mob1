angular.module('problems.controllers',[])

    .controller('ProblemsCtrl', ['$scope', '$state','$ionicPopup','$ionicHistory', 'Storage', 'PanneProvider', function ($scope, $state,$ionicPopup,$ionicHistory, Storage, PanneProvider) {

        // ======== LES VARIABLES DU SCOPE ===========================
        showPannes();
        // ======== VARIABLES INTERNES ===============================

        // ======== INITIALISATION ===================================

        // ========= LES ROUTES ======================================

        $scope.goToHome = function () {
            $ionicHistory.goBack();
        };

        // ========= LES FONCTIONS DU SCOPE ==========================

        $scope.cancelProblem = function(panne){
            PanneProvider.remove(panne.id)
                .then(function(response){
                    showPannes();
                    console.log(response);
                }).catch(function(error){
                console.log(error);
            })
        };

        // ========= LES FONCTIONS INTERNES ==========================

        function showPannes(){
            console.log(Storage.getStorage('pannes'));
            $scope.pannes = Storage.getStorage('pannes');
            if($scope.pannes <= 0)
                $scope.goToHome();


            /*
            PanneProvider.getOneByTruck(Storage.getStorage('user').data.user.truck)
                .then(function(response){
                    $scope.pannes = response.pannes;
                    console.log($scope.pannes);
                    if($scope.pannes.length <= 0)
                        $state.go("home");
                }).catch(function(response){
            });
             */
        }
        // ========= LES POPUPS ======================================

        // ========= LES EVENEMENTS ==================================

    }]);
