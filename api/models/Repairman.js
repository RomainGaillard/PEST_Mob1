/**
* Repairman.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    state:{
      type:'string',
      enum:['Occupé','Libre'],
      defaultsTo:'Libre'
    },
    user:{
      model:'User',
      columnName:'user_id'
    },
    currentPanne:{
      model:'Panne',
      columnName:'current_panne_id'
    }
  }
};

