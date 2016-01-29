/**
 * Created by Romain Gaillard on 08/01/2016.
 */


angular.module('provider')

    .factory('TruckProvider',['SETTINGS','Restangular','Storage', function TruckProvider(SETTINGS,Restangular,Storage) {
        var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
        return {
            'create': create,
            'remove': remove,
            'update': update,
            'getAll': getAll,
            'getOne': getOne,
            'updateLocation':updateLocation,
            'getAll_socket':getAll_socket
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
            return provider.one('trucks').getList();
        }

        function getAll_socket(callback){
            io.socket.get("http://localhost:1337/trucks",{token:getToken()},function(trucks,jwres){
                if(jwres.statusCode == 200){
                    callback(trucks);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                    callback(new Array());
                }
            })
        }

        function getOne(idTruck,callback){
            //return provider.one('truck', idTruck).get();
            io.socket.get("http://localhost:1337/truck/"+idTruck,{token:getToken()},function(truck,jwres){
                if(jwres.statusCode == 200){
                    //console.log(truck);
                    callback(truck);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                    callback(null);
                }
            })

        }

        function updateLocation(latLng){
            var idTruck = Storage.getStorage("user").data.user.truck;
            var loc = JSON.stringify(latLng);
            io.socket.put("http://localhost:1337/truck/"+idTruck,{token:getToken(),location:loc},function(truck,jwres){
                if(jwres.statusCode == 200){
                    console.log(truck);
                }
                else{
                    console.log(jwres.statusCode)
                    console.log('Erreur'+jwres.body.err);
                }
            })
        }

        function getToken(){
            return ""+Storage.getStorage("token");
        }
    }]);
//})();
