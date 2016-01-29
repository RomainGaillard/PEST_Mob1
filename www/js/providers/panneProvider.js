/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('PanneProvider',['SETTINGS','Restangular','Storage', function PanneProvider(SETTINGS,Restangular,Storage) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);

        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne,
            'getOneByTruck': getOneByTruck
        };

        function create(panne,AddPanne) {
            //return provider.one('panne').customPOST(panne);
            io.socket.post("http://localhost:1337/panne/",{token:getToken(),priority:panne.priority,comment:panne.comment,truck:panne.truck,typePanne:panne.typePanne},function(panne,jwres){
                if(jwres.statusCode == 201){
                    AddPanne(panne);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                }
            })
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

        function getToken(){
            return ""+Storage.getStorage("token");
        }
    }]);
//})();
