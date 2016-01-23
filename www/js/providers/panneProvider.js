/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('PanneProvider',['SETTINGS','Restangular', function PanneProvider(SETTINGS,Restangular) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne,
            'getOneByTruck': getOneByTruck
        };

        function create(panne) {
            return provider.one('panne').customPOST(panne);
        }

        function remove(idPanne) {
            return provider.one('panne', idPanne).remove();
        }

        function update(idPanne, panne) {
            return provider.one('panne', idPanne).customPUT(panne);
        }

        function getAll() {
            return provider.one('panne').getList();
        }

        function getOne(idPanne){
            return provider.one('panne', idPanne).get();
        }

        function getOneByTruck(idTruck){
            return provider.one('truck', idTruck).one('pannes').customGET();
        }
    }]);
//})();
