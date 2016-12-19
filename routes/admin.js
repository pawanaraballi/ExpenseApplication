var jwt = require('jsonwebtoken');
var express = require('express');
var admin = express.Router();
var mysql = require('../models/mysql');
var verify_token = require('../models/verify');
var passwordHash = require('password-hash');
//var pass = require('pwd');

admin.get('/home', function (req, res,next) {

    verify_token.verify(req.session.token,function(err, decoded) {

        console.log(decoded);
        if(!err && decoded.tag == 'admin'){
            
            user = decoded.user;
            mysql.getAllExpenses(function(model) {
                console.log("I am here" + model);
                var data = JSON.stringify(model);
                res.render('pages/admin_dashboard',{data : data});
            });
        }else{
            console.log(err);
            user = null ;
            req.session.token = null ;
            res.render('pages/logout',{statusCode:200 , message : 'invalid session please login'});

        }
    });
});


admin.post('/addExpenses', function (req, res,next) {
    console.log('addExpenses');
    verify_token.verify(req.session.token,function(err, decoded) {
        if (!err && decoded.tag == 'admin') {
            amt = req.body.amount.toPrecision(4);
            var data = {
              username:req.body.username,
              description: req.body.description,
              amount: amt,
              datetimee:req.body.datetimee
            };
            data.username = decoded.user;
            mysql.putUserExpense(data,function (model) {
                if(model == null){
                    res.json({statusCode : 200 , message:"data not stored"})
                }else{
                    res.json({statusCode : 200 , message:"data stored"})
                    res.render('pages/admin_dashboard');
                }
            })

        }
        else {
            console.log(err);
            res.json({statusCode: 200, message: " invalid user ", data: null});
        }
    });
});



admin.get('/removeExpense', function (req, res,next) {
    console.log('removeExpense');
    verify_token.verify(req.session.token,function(err, decoded) {

        if(!err && decoded.tag == 'admin'){
            //console.log("time =" + req.query.ss);
            desc = req.query.ss;
            user = req.query.user;
            var data  = {
                username : user,
                description : desc
            };

            console.log(data);
            mysql.deleteUserExpense(data , function (model) {
                if(model != null){
                    //res.redirect('/supporter/home');
                }else{
                    res.render('pages/admin_dashboard');
                }
            })
        }else{
            console.log(err);
            user = null ;
            req.session.token = null ;
            res.render('pages/logout',{statusCode:200 , message : 'invalid session please login'});

        }
    });
});


admin.post('/add', function (req, res,next) {
console.log("Inside admin add");
console.log(req.body.email);
            mysql.getAdmin(req.body.email,function(model){
                if(model ==  null){
                    var data = req.body;
                    console.log(data);
                    hashedPassword = passwordHash.generate(data.password);
                    var login_details = {
                        username : data.email,
                        password : data.password,
                        tag : 'admin'

                    }
                    delete data.password;
                    delete hashedPassword;

                    mysql.putAdmin(data,function(user){
                        console.log(user);
                    });
                    mysql.putLoginDetails(login_details,function(user){
                        console.log(user);
                    });
                    res.redirect('/admin/home');

                }else{

                    res.send({error : 'user already exists'});

                }
            });
});

module.exports = admin;