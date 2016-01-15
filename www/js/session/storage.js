/**
 * Created by Caup Dorian on 15/01/2016.
 */
(function(){
  'use strict';

  angular
    .module('storage', ['LocalStorageModule'])
    .factory('Storage', Storage);

  function Storage(localStorageService){
    return{
      setStorage: setStorage,
      getStorage: getStorage,
      setObject: setObject,
      getObject: getObject,
      clearStorage: clearStorage
    };

    function setStorage(key, value){
      localStorageService.set(key,value);
    }

    function getStorage(key){
      return localStorageService.get(key);
    }

    /**
     * @param {string} key
     * @param {Object} value
     */
    function setObject(key, value) {
      localStorageService.set(key, JSON.stringify(value));
    }

    /**
     * @param {string} key
     * @returns {object | null}
     */
    function getObject(key) {
      return JSON.parse(localStorageService.get(key) || null);
    }

    function clearStorage(){
      localStorageService.clearAll();
    }
  }
})();
