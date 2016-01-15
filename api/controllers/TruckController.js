/**
 * TruckController
 *
 * @description :: Server-side logic for managing trucks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create:function(req,res){
        Truck.create(req.body).exec(function(err,truck){
            if(err) return res.serverError({error:"impossible de cr�er le camion"});

            if(truck){
                if(truck.currentUser && !ToolsUtils.isEmpty(truck.currentUser)){
                    User.update(truck.currentUser, {truck:truck.id}).exec(function(err,user){});
/*                    User.findOne({id:truck.currentUser}.exec(function(err,user){
                        if(err) return res.serverError({error: "impossible de retrouver le user pour faire l'association"});

                        if(user){
                            user.truck = truck.currentUser;

                            user.save(function(err){
                                if(err) return res.serverError({error: "impossible de faire l'association avec le user"});

                                return res.json(201, {truck: truck});
                            })
                        }else return res.notFound({error: "user non existant pour l'association"})
                    }))*/
                }

                return res.json(201, {truck: truck})
            }else return res.json(500, {error: "impossible de cr�er le camion"})
        })
    },

    getPannesByTruck:function(req,res){
        var truck = req.param("id_truck");
        if(!truck) return res.badRequest({error:'wrong path'});
        Panne.find({truck:req.param("id_truck")}).exec(function(err,pannes){
            if(pannes){
                sails.log.debug("=> GetPannesByTruck: Succ�s");
                return res.status(200).json({pannes:pannes})
            }
            sails.log.debug("=> GetPannesByTruck: Erreur");
            return res.status(400).json({err:"get Pannes: Erreur"})
        })
    },

    trucks:function(req,res){
        if (req.user.right === "Admin"){
            Truck.find({}).exec(function(err,trucks){
                if(err) return res.serverError({error:'impossible de r�cup�rer les camions'})

                if(trucks){
                    if(req.isSocket){
                        for(var i=0;i<group.length;i++){
                            Truck.subscribe(req, trucks[i].id)
                        }

                        return res.status(200).json(trucks)
                    }else return res.ok(trucks)
                }
            })
        }else return res.status(403).json({error: "must be administrator"})
    },

    // todo relation one to one si on change l'id du currentUser il faut que l'ancien user et le nouveau le sache

    update:function(req,res){
        var name = req.param("name");
        var location = req.param("location");
        var running = req.param("running");
        var state = req.param("state");
        var company = req.param("id_company");
        var currentUser = req.param("current_user");
        Truck.findOne({id:req.param("id_truck")}).exec(function(err,truck){
            if(err) return res.serverError({error:"erreur serveur"})

            if(truck){
                if(location && !ToolsService.isEmpty(location)){
                    truck.location = req.param("location")
                }
                if(name && !ToolsService.isEmpty(name)){
                    truck.name = name
                }
                if(running && ToolsService.isBoolean(running)){
                    truck.running = ToolsService.getBoolean(running)
                }
                if(state && !ToolsService.isEmpty(state)){
                    truck.state = state
                }
                if(company && !ToolsService.isEmpty(company)){
                    truck.company = company
                }
                if(currentUser && !ToolsService.isEmpty(currentUser)){
                    truck.currentUser = currentUser
                }

                truck.save(function(err){
                    if(err) return res.serverError({error:"impossible de sauvegarder en base"})
                    Truck.publishUpdate(truck.id,{truck:truck})
                    return res.ok({message:"truck bien update"})
                })
            }else return res.badRequest({error:"truck not found"})
        })
    }
};

