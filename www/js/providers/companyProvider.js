/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('CompanyProvider',['SETTINGS','Restangular', function CompanyProvider(SETTINGS,Restangular) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne
        };

        function create(company) {
            return provider.one('company').customPOST(company);
        }

        function remove(idCompany) {
            return provider.one('company', idCompany).remove();
        }

        function update(idCompany, company) {
            return provider.one('company', idCompany).customPOST(company);
        }

        function getAll() {
            return provider.one('company').getList();
        }

        function getOne(idCompany){
            return provider.one('company', idCompany).get();
        }
    }]);
//})();
