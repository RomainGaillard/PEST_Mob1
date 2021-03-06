/**
 * Created by Caup Dorian on 08/01/2016.
 */
/**
 * Created by Caup Dorian on 13/11/2015.
 */
/*(function(){
  'use strict';
  angular
    .module('provider', ['restangular'])
    .factory('UserProvider', UserProvider);

  UserProvider.$inject = [
    'restangular',
    'SETTINGS'
  ];
*/

angular.module('provider')

    .factory('UserProvider',['SETTINGS','Restangular', function UserProvider(SETTINGS,Restangular) {
    var provider = Restangular.setBaseUrl(SETTINGS.BASE_API_URL);
    return {
      'create': create,
      'remove': remove,
      'update': update,
      'getAll': getAll,
      'getOne': getOne
    };

    function create(user) {
      return provider.one('user').customPOST(user);
    }

    function remove(idUser) {
      return provider.one('user', idUser).remove();
    }

    function update(idUser, user) {
      return provider.one('user', idUser).customPUT(user);
    }

    function getAll() {
      return provider.one('users').getList();
    }

    function getOne(idUser){
      return provider.one('user', idUser).get();
    }
  }]);
//})();
