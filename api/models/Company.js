/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required:true
    },
    address:{
      type: 'string'
    },
    numberPhone: {
      type: 'string'
    },
    type:{
      type:'string',
      enum:['transporteur','depanneur'],
      required:true
    },
    users: {
      collection: 'user',
      via: 'company'
    },
    trucks:{
      collection:'truck',
      via:'company'
    }
  }
};

