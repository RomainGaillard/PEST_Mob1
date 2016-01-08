/**
 * Created by Romain Gaillard on 08/01/2016.
 */

/**
 * Created by Romain Gaillard on 29/10/2015.
 */

angular.module('constants.services')

    .service('ConstantsSrv', function() {

        var domain = "http://localhost:1337/";
        //var domain = "http://10.33.0.52:1337/";

        this.group           = domain+"group";
        this.createGroup     = domain+"group/create";
    });
