/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('TruckProvider',['SETTINGS','Restangular', function TruckProvider(SETTINGS,Restangular) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne
        };

        function create(truck) {
            return provider.one('truck').customPOST(truck);
        }

        function remove(idTruck) {
            return provider.one('truck', idTruck).remove();
        }

        function update(idTruck, truck) {
            return provider.one('truck', idTruck).customPOST(truck);
        }

        function getAll() {
            return provider.one('truck').getList();
        }

        function getOne(idTruck){
            return provider.one('truck', idTruck).get();
        }
    }]);
//})();
