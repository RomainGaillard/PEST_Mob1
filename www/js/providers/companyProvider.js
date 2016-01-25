/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('CompanyProvider',['SETTINGS','Restangular','Storage', function CompanyProvider(SETTINGS,Restangular,Storage) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        var token = ""+Storage.getStorage("user").data.token;

        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne,
            'getTrucks':getTrucks
        };

        function create(company) {
            return provider.one('company').customPOST(company);
        }

        function remove(idCompany) {
            return provider.one('company', idCompany).remove();
        }

        function update(idCompany, company) {
            return provider.one('company', idCompany).customPUT(company);
        }

        function getAll() {
            return provider.one('company').getList();
        }

        function getOne(idCompany){
            return provider.one('company', idCompany).get();
        }

        function getTrucks(callback){
            io.socket.get("http://localhost:1337/company/trucks",{token:token},function(res,jwres){
                if(jwres.statusCode == 200){
                    console.log(res);
                    callback(res.trucks);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                    callback(new Array());
                }
            })
        }
    }]);
//})();
