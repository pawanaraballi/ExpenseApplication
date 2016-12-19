var jwt = require('jsonwebtoken');
var express = require('express');
console.log('login.js');
var login = express.Router();
var mysql = require('../models/mysql');
var passwordHash = require('password-hash/lib/password-hash');

login.get('/', function (req, res,next) {

    console.log(req.session);

    var user = req.query.username;
    var password = req.query.password;

    console.log(user);
    if(user == null || password == null){
        res.render('pages/login',{statusCode : 200 , message : "" , error: null});
    }else{
        mysql.getLoginDetails(user,function(model) {
            if(model ==  null){
                console.log("no data");
                res.render('pages/login',{statusCode : 200 , message : "invalid credentials" , error: "invalid credentials"});

            }else{
                console.log(model.get('password'));
                console.log(password);
                console.log(model.get('tag'));
                console.log(passwordHash.verify('sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97', password));
                //if(passwordHash.verify(model.get('password'), password)){
                    if(model.get('password') == password){
                    var token = jwt.sign({ user: user , tag :model.get('tag') }, 'test' ,  {expiresIn:'1800000', jwtid: 'jwtid' });
                    req.session.token = token;
                        if(model.get('tag') == 'admin'){
                            console.log("I am here in admin login")
                            res.redirect('/admin/home');
                        }
                        if(model.get('tag') == 'user'){
                            res.redirect('/user/home');
                        }
                }
                else{
                    res.render('pages/login',{statusCode : 200 , message : "invalid credentials" , error: "invalid credentials"});
                }
            }
        })

    }
});

module.exports = login;