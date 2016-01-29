/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('TypePanneProvider',['SETTINGS','Restangular', function TypePanneProvider(SETTINGS,Restangular) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne
        };

        function create(typePanne) {
            return provider.one('type_Panne').customPOST(typePanne);
        }

        function remove(idTypePanne) {
            return provider.one('type_Panne', idTypePanne).remove();
        }

        function update(idTypePanne, typePanne) {
            return provider.one('type_Panne', idTypePanne).customPUT(typePanne);
        }

        function getAll() {
            return provider.one('type_Panne').getList();
        }

        function getOne(idTypePanne){
            return provider.one('type_Panne', idTypePanne).get();
        }


    }]);
//})();
