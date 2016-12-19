var jwt = require('jsonwebtoken');

module.exports.verify = function(token,callback) {
jwt.verify(token, 'test' ,  { jwtid: 'jwtid' } ,callback);
}
