/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `UserController.create()`
     */
    create: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return res.json(401, {err: 'Password doesn\'t match, What a shame!'});
        }
        User.create(req.body).exec(function (err, user) {
            if (err) {
                return res.json(err.status, {err: err});
            }
            // If user created successfuly we return user and token as response
            if (user) {
                // NOTE: payload is { id: user.id}
                Truck.update(user.truck, {currentUser:user.id}).exec(function (req,truck) {})
                
/*                Truck.findOne({id:user.truck}).exec(function(err,truck){
                    if(err) return res.serverError({error: "impossible de retrouver le truck pour faire l'association"});

                    if(truck){

                        /!*truck.currentUser = user.id

                        truck.save(function(err){
                            if(err) return res.serverError({error: "impossible de faire l'association avec le truck"});

                            return res.json(201, {user:user})
                        })*!/
                    }else return res.notFound({error:"le truck � cet id n'existe pas"})
                })*/
                res.json(200, {user: user, token: jwToken.issue({id: user.id})});
            }else return res.json(500, {error: "impossible de cr�er le camion"})
        });
    }

    // todo relation one to one si on change l'id du truck il faut que l'ancien truck et le nouveau le sache
};

