var express = require('express');
var bodyParser = require('body-parser');
var {User} = require('../model/user');
// var {authenticate} = require('../middleware/authenticate');
var userRouter = express.Router();
userRouter.use(bodyParser.json());
const _ = require('lodash');

/**
 * User signup route as a POST /
 * Save user data
 * @object {User}
 */
userRouter.post('/', (req, res, next) => {
    var body = _.pick(req.body, ['email', 'password', 'username', 'free_points', 'purchased_points'])
    var user = new User(body);
    user.save().then((savedUser) => {
        // User saved successfully
        return user.generateAuthToken();
    }).then((token) => {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        console.log('************************************');
        console.log('UserToken :');
        console.log(token);
        console.log('************************************');
        res.header("x-auth", token);
        res.send(user);
    }).catch((err) => {
        // Unable to save user
        // console.log("From Catch block for error"+JSON.stringify(err, undefined, 4));
        res.status(400).send({"error":true,"message":"Due to bad request unable to save user data"});
    });
});

/**
 * Used to get user token
 * @type {[type]}
 */
userRouter.get('/me', (req, res, next) => {
    res.send(req.user);
});

/**
 * Used to perform user login operation
 * @type {[type]}
 */
userRouter.post('/login', (req, res, next) => {
    var body = _.pick(req.body,['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch((e) => {
        res.status(400).send({"error":true,"message":"Due to bad request unable to perform user login"});
    });
});

/**
 * Used to perform user logout operation
 * @type {[type]}
 */
userRouter.delete('/me/token', (req, res, next) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({"error":false,"success":true,"message":"User logged out from the system successfully"});
    }, (err) => {
        res.status(400).send({"error":false,"success":true,"message":"Due to bad request unable to perform user login"});
    });
});

module.exports = userRouter;
