/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,
  attributes: {
    //company: {
    //  model:'company',
    //  required:true,
    //  columnName: 'id_company'
    //},
/*    truck: {
      model:'truck',
      columnName: 'id_truck',
    },

    repairman: {
      model:'repairman',
      columnName:'id_repairman'
    },*/
    firstname: {
      type: 'string',
      required: 'true',
      size: 24
    },

    lastname: {
      type:'string',
      required: 'true',
      size: 24
    },

    email: {
      type: 'email',
      required: 'true',
      unique: true
    },

    right: {
      type: 'string',
      enum:['User','Admin'],
      defautlsTo:'User'},

    phoneNumber: {
      type: 'string',
      defaultsTo: 'Undefined'
    },

    encryptedPassword: {
      type: 'string'
    },
    // We don't wan't to send back encrypted password either
    toJSON: function () {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    }
  },

  beforeCreate : function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);
      bcrypt.hash(values.password, salt, function (err, hash) {
        if(err) return next(err);
        values.encryptedPassword = hash;
        next();
      })
    })
  },

  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.encryptedPassword, function (err, match) {

      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  }
};

