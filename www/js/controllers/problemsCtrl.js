angular.module('problems.controllers',[])

    .controller('ProblemsCtrl', ['$scope', '$state','$ionicPopup','$ionicHistory', 'Storage', 'PanneProvider', function ($scope, $state,$ionicPopup,$ionicHistory, Storage, PanneProvider) {

        // ======== LES VARIABLES DU SCOPE ===========================
        $scope.myUser = Storage.getStorage("user").data.user;
        console.log($scope.myUser);

        // ======== VARIABLES INTERNES ===============================

        // ========= LES ROUTES ======================================

        $scope.goToHome = function () {
            $ionicHistory.goBack();
        };

        // ======== INITIALISATION ===================================
        showPannes();


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
            $scope.pannes = Storage.getStorage('pannes');
            if($scope.pannes > 0) {
                formatDate();
            }
        }

        function formatDate(){
            for(var i=0;i<$scope.pannes.length;i++){
                var date = new Date($scope.pannes[i].createdAt);
                var h = date.getHours();
                var m = date.getMinutes();
                var j = date.getDate();
                $scope.pannes[i].createdAt = "le "+j+" à "+h+"h"+m;
            }
        }
        // ========= LES POPUPS ======================================

        // ========= LES EVENEMENTS ==================================

    }]);
