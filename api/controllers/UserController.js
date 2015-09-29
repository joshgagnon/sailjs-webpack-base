// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require('bcrypt'));


_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

    userInfo: function(req, res){
        User.findOne({id: req.user.id})
        .populate('roles')
        .then(function(r){
            res.json(r);
        })
    },

    setPassword: function(req, res) {
        sails.models.passport.findOne({
              protocol : 'local'
            , user     : req.user.id
            })
            .then(function(passport){
                return bcrypt.compareAsync(req.allParams().oldPassword||'', passport.password)
                    .then(function(match){
                        if(!match){
                            throw new sails.config.exceptions.ForbiddenException('Incorrect Password');
                        }
                        return passport.changePassword(req.allParams().newPassword)
                    });
            })
            .then(function(match){
                res.ok();
            })
            .catch(sails.config.exceptions.ForbiddenException, function(err){
                res.forbidden({'oldPassword': [err]});
            })
            .catch(sails.config.exceptions.ValidationException, function(err){
                res.badRequest({'newPassword': [err]});
            })
    }
});
