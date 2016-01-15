/**
* Truck.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type:'string',
      defaultsTo:'unamed'
    },
    running:{
      type:'boolean',
      defaultsTo:'false'
    },
    state:{
      type:'string',
      enum:['En Panne','Ok'],
      defaultsTo:'Ok'
    },
    location:{
      type:'string'
    },
    company:{
      model:'Company',
      required:'true',
      columnName: 'company_id'
    },
    currentUser:{
      model:'User',
      columnName:'current_user_id'
    },
    pannes:{
      collection:'panne',
      via:'truck'
    }
  }
};

