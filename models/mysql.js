var mysql = require('mysql');
var knex = require('knex')({
    client:'mysql',
    connection: {
        host : 'pawanaraballi.cdksdcpjqdqb.us-west-2.rds.amazonaws.com',
        user : 'araballipawan',
        password : '11111111',
        port : '3306',
        database: "myexpenseapp"
    }
});

var bookshelf = require('bookshelf')(knex);

//Login
var Login = bookshelf.Model.extend({
    tableName: 'Login'
});

module.exports.getLoginDetails = function(user,callback) {
    console.log(user);
    new Login({username: user })
        .fetch()
        .then(callback);
}

//Admin

var User = bookshelf.Model.extend({
    tableName: 'Users'
});

module.exports.getUser = function(user,callback) {
    new User({email: user })
        .fetch()
        .then(callback);
}

module.exports.putUser = function(user,callback) {
    new User(user).save()
        .then(callback);

}




//Admin

var Admin = bookshelf.Model.extend({
    tableName: 'Admin'
});

module.exports.getAdmin = function(user,callback) {
    new Admin({email: user })
        .fetch()
        .then(callback);
}

module.exports.putAdmin = function(user,callback) {
    new Admin(user).save()
        .then(callback);

}

module.exports.putLoginDetails = function(data,callback) {
    console.log("Inside putLoginDetails" + data);
    new Login(data).save()
        .then(callback);
}

//UsersExpenses
var UsersExpenses = bookshelf.Model.extend({
    tableName: 'Expenses'
});

module.exports.putUserExpense = function(data,callback){
    new UsersExpenses(data).save().then(callback);
}

module.exports.deleteUserExpense = function(description,callback){
    new UsersExpenses().where({description:description.description}).destroy().then(callback);
}

module.exports.updateExpense = function(data,callback){
    new UsersExpenses(data).save().then(callback);
}

module.exports.getUserAllExpenses = function(user,callback) {
    new UsersExpenses().where({username : user}).fetchAll().then(callback);
}

module.exports.getAllExpenses = function(callback) {
    new UsersExpenses().fetchAll().then(callback);
}

module.exports.updateExpense = function(user,remainingdata, callback) {
    new UsersExpenses().where({username: user}).save(remainingdata, {patch: true}).then(callback);
}