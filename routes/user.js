var jwt = require('jsonwebtoken');
var express = require('express');
var user = express.Router();
var mysql = require('../models/mysql');
var verify_token = require('../models/verify');
var passwordHash = require('password-hash');

//Landing page or Dashboard
user.get('/home', function (req, res,next) {

    verify_token.verify(req.session.token,function(err, decoded) {

        console.log(decoded);
        if(!err && decoded.tag == 'user'){
            
            user = decoded.user;
            mysql.getUserAllExpenses(user,function (model) {
                console.log("I am here" + model);
                var data = JSON.stringify(model);
                res.render('pages/user_dashboard',{data : data});
            });
        }else{
            console.log(err);
            user = null ;
            req.session.token = null ;
            res.render('pages/logout',{statusCode:200 , message : 'invalid session please login'});

        }
    });
});

//Add New Expense
user.post('/addExpenses', function (req, res,next) {
    console.log('addExpenses');
    verify_token.verify(req.session.token,function(err, decoded) {
        if (!err && decoded.tag == 'user') {
            amt = req.body.amount.toPrecision(4);
            console.log("I am old");
            console.log(req.body.datetimee);
            if(req.body.datetimee == ""){
             if (req.body.username == decoded.user){
                var data = {
                  username:req.body.username,
                  description: req.body.description,
                  amount: amt
                };
                data.username = decoded.user;
                mysql.putUserExpense(data,function (model) {
                    if(model == null){
                        res.json({statusCode : 200 , message:"data not stored"})
                    }else{
                        res.json({statusCode : 200 , message:"data stored"})
                        res.render('pages/user_dashboard');
                    }
                })
            }
            else {
            console.log(err);
            res.json({statusCode: 200, message: " invalid user ", data: null});
            }   
        }else{
            if (req.body.username == decoded.user){
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
                        res.render('pages/user_dashboard');
                    }
                })
            }
            else {
            console.log(err);
            res.json({statusCode: 200, message: " invalid user ", data: null});
            }
        }
            
        }
        else {
            console.log(err);
            res.json({statusCode: 200, message: " invalid user ", data: null});
        }
    });
});

//Remove Expense
user.get('/removeExpense', function (req, res,next) {

    verify_token.verify(req.session.token,function(err, decoded) {

        if(!err && decoded.tag == 'user'){
            user = decoded.user;
            //console.log("time =" + req.query.ss);
            desc = req.query.ss;
            var data  = {
                username : user,
                description : desc
            };

            console.log(data);
            mysql.deleteUserExpense(data , function (model) {
                if(model != null){
                    //res.redirect('/supporter/home');
                }else{
                    res.render('pages/user_dashboard');
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

//Update Expense
user.get('/updateExpense', function (req, res,next) {

    verify_token.verify(req.session.token,function(err, decoded) {

        console.log(decoded);
        if(!err && decoded.tag == 'user'){
            console.log(decoded.user);
            user = decoded.user;
            console.log(req.query.description);
            data = {
                username:req.query.username,
                description:req.query.description,
                amount:req.query.amount
            }
            console.log(data);
            res.send('0');
        }else{
            console.log(err);
            user = null ;
            req.session.token = null ;
            res.render('pages/logout',{statusCode:200 , message : 'invalid session please login'});

        }
    });
});

//Add new user from postman
user.post('/add', function (req, res,next) {
console.log("Inside admin add");
console.log(req.body.email);
            mysql.getAdmin(req.body.email,function(model){
                if(model ==  null){
                    var data = req.body;
                    console.log(data);
                    hashedPassword = passwordHash.generate(data.password);
                    var login_details = {
                        username : data.email,
                        password : hashedPassword,
                        tag : 'user'

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

                    res.render('pages/add_supporter',{error : 'user already exists'});

                }
            });
});



module.exports = user;