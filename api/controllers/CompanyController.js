/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getTrucksByCompany:function(req,res){
        var truck = req.param("id_company");
        if(!truck) return res.badRequest({error:'wrong path'});
        Truck.find({company:req.param("id_company")}).exec(function(err,pannes){
            if(pannes){
                sails.log.debug("=> getTrucksByCompany: Succès");
                return res.status(200).json({pannes:pannes})
            }
            sails.log.debug("=> getTrucksByCompany: Erreur");
            return res.status(400).json({err:"get Company: Erreur"})
        })
    }
};

