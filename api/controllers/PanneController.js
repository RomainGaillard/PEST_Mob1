/**
 * PanneController
 *
 * @description :: Server-side logic for managing Pannes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var panneModel = require('../models/Panne.js');


module.exports = {

    create: function(req,res){
        //panneModel.comment = req.param('comment');
        Panne.create().exec(function(err,panne){
            if(panne){
                sails.log.debug("=> Creation PANNE: Succès");
                console.log(panne);
                if(req.isSocket)
                    Panne.subscribe(req,panne.id);
                return res.status(201).json({created:panne})
            }
            sails.log.debug("=> Creation PANNE: Erreur");
            return res.status(400).json({err:"create Panne: Erreur. "+err})
        })
    },
    update:function(req,res){
        Panne.findOne({id:req.param("idPanne")}).exec(function(err,panne) {
            if (panne) {
                panne.comment = req.param("comment");
                panne.priority = req.param("priority");
                panne.state = req.param("state");

                panne.save(function (err) {
                    if (err) {
                        sails.log.debug("=> Edit PANNE: Erreur");
                        return res.status(400).json({err: "edit Panne: Erreur"})
                    }
                    sails.log.debug("=> Edit PANNE: Succès");
                    console.log(panne);
                    Panne.publishUpdate(panne.id, panne);
                    return res.status(200).json({updated:panne});
                })
            }
        })
    },
    getMyPannes:function(req,res){
        Panne.find({truck:req.param("idTruck")}).exec(function(err,pannes){
            if(pannes){
                sails.log.debug("=> GetMyPannes: Succès");
                return res.status(200).json({pannes:pannes})
            }
            sails.log.debug("=> GetMyPannes: Erreur");
            return res.status(400).json({err:"get (my) Pannes: Erreur"})
        })
    }

};

