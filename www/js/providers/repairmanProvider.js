/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('RepairmanProvider',['SETTINGS','Restangular', function RepairmanProvider(SETTINGS,Restangular) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne
        };

        function create(repairman) {
            return provider.one('repairman').customPOST(repairman);
        }

        function remove(idRepairman) {
            return provider.one('repairman', idRepairman).remove();
        }

        function update(idRepairman, repairman) {
            return provider.one('repairman', idRepairman).customPOST(repairman);
        }

        function getAll() {
            return provider.one('repairman').getList();
        }

        function getOne(idRepairman){
            return provider.one('repairman', idRepairman).get();
        }
    }]);
//})();
