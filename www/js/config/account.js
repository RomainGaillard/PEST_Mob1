/**
 * Created by Caup Dorian on 08/01/2016.
 */
(function() {

  angular
    .module('starter')
    .config(AuthConfig)
  ;

  AuthConfig.$inject = ['$authProvider', 'SETTINGS'];

  function AuthConfig($authProvider, SETTINGS) {
    $authProvider.baseUrl = SETTINGS.BASE_API_URL;
    $authProvider.signupUrl = '/user/create';
    $authProvider.loginUrl = '/auth/local';
  }
})();
