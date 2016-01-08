/**
 * Created by Romain Gaillard on 08/01/2016.
 */

/**
 * Created by Romain Gaillard on 25/10/2015.
 */


angular.module('users.services',[])

    .factory('Users',['$resource','ConstantsSrv','AuthSrv', function ($resource,ConstantsSrv,AuthSrv) {
        return $resource(ConstantsSrv.group,{code:'@code'},{
            get:{
                method:'DELETE',
                url:ConstantsSrv.exitGroup,
                params:{code:'@code'},
                headers: {
                    'Authorization': AuthSrv.getUser().token
                }
            },
            delete:{
                method:'DELETE',
                url:ConstantsSrv.destroyGroup,
                params:{code:'@code'},
                headers: {
                    'Authorization': AuthSrv.getUser().token
                }
            },
            removeLock:{
                method:"POST",
                url:ConstantsSrv.removeLock,
                params:{code:'@code',id:'@lockId'},
                headers: {
                    'Authorization': AuthSrv.getUser().token
                }
            },

        });
    }]);
