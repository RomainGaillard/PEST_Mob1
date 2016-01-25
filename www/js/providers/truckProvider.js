/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('TruckProvider',['SETTINGS','Restangular','Storage', function TruckProvider(SETTINGS,Restangular,Storage) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        var token = ""+Storage.getStorage("user").data.token;
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne,
            'updateLocation':updateLocation
        };

        function create(truck) {
            return provider.one('truck').customPOST(truck);
        }

        function remove(idTruck) {
            return provider.one('truck', idTruck).remove();
        }

        function update(idTruck, truck) {
            return provider.one('truck', idTruck).customPUT(truck);
        }

        function getAll() {
            return provider.one('truck').getList();
        }

        function getOne(idTruck){
            return provider.one('truck', idTruck).get();
        }

        function updateLocation(latLng){
            var idTruck = Storage.getStorage("user").data.user.truck;
            var loc = JSON.stringify(latLng);
            io.socket.put("http://localhost:1337/truck/"+idTruck,{token:token,location:loc},function(truck,jwres){
                if(jwres.statusCode == 200){
                    console.log(truck);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                }
            })
        }
    }]);
//})();
