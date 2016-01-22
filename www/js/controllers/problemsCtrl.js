angular.module('problems.controllers',[])

    .controller('ProblemsCtrl', ['$scope', '$state','$ionicPopup','$stateParams','$ionicHistory', 'Storage', 'PanneProvider', function ($scope, $state,$ionicPopup,$stateParams,$ionicHistory, Storage, PanneProvider) {

        // ======== LES VARIABLES DU SCOPE ==========================
        showPannes();
        // ======== VARIABLES INTERNES ===============================

        // ======== INITIALISATION ===================================

        // ========= LES ROUTES ======================================

        // ========= LES FONCTIONS DU SCOPE ============================
        $scope.goToHome = function () {
            $state.go("home",{},{reload:false});
        };

        $scope.cancelProblem = function(panne){
            PanneProvider.remove(panne.id)
                .then(function(response){
                    showPannes();
                    console.log(response);
                }).catch(function(error){
                console.log(error);
            })
        };

        // ========= LES FONCTIONS INTERNES ============================

        function showPannes(){
            PanneProvider.getOneByTruck(Storage.getStorage('user').data.user.truck)
                .then(function(response){
                    $scope.pannes = response.pannes;
                    console.log($scope.pannes);
                    if($scope.pannes.length <= 0)
                        $state.go("home");
                }).catch(function(response){

            });
        }
        // ========= LES POPUPS ========================================

        // ========= LES EVENEMENTS ====================================

    }]);
