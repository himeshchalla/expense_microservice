//mocha --debug-brk --inspect --allow-uncaught --full-trace --no-warnings --recursive ./server/**/*.test.js
const {ObjectID} = require('mongodb');
const {User} = require('./../../model/user');
const {Expense} = require('./../../model/expense');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Initial test data of users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [{
    "_id": userOneId,
    "email":"test1@example.com",
    "password":"userOnePass",
    "username":"testUser1",
    "free_points":50,
    "purchased_points":10,
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET_KEY).toString()
    }]
},
{
    "_id": userTwoId,
    "email":"test2@example.com",
    "password":"testpassword2",
    "username":"testUser2",
    "free_points":100,
    "purchased_points":0,
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET_KEY).toString()
    }]
},
{
    "_id": userThreeId,
    "email":"test3@example.com",
    "password":"testpassword3",
    "username":"testUser3",
    "free_points":170,
    "purchased_points":150,
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userThreeId, access: 'auth'}, process.env.JWT_SECRET_KEY).toString()

    }]
}
];
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        var userThree = new User(users[2]).save();
        return Promise.all([userOne, userTwo, userThree]);
    })
    .then((data) => {
        done();
    })
    .catch((err) => done(err));
}

// Initial test data of item inventory
const expenses = [{
    "_id": new ObjectID(),
    "name" : "expense1",
    "description": "test description for expense1",
    "amount": 10,
    "createdAt": moment().valueOf(),
    "updatedAt": moment().valueOf(),
},
{
    "_id": new ObjectID(),
    "name" : "expense2",
    "description": "test description for expense2",
    "amount": 20,
    "createdAt": moment().valueOf(),
    "updatedAt": moment().valueOf(),
},
{
    "_id": new ObjectID(),
    "name" : "expense3",
    "description": "test description for expense3",
    "amount": 0,
    "createdAt": moment().valueOf(),
    "updatedAt": moment().valueOf(),
},
{
    "_id": new ObjectID(),
    "name" : "expense5",
    "description": "test description for expense5",
    "amount": 50,
    "createdAt": moment().valueOf(),
    "updatedAt": moment().valueOf(),
}];
// Used to perform task before each test case run
const populateExpense = (done) => {
    Expense.remove({}).then(() => {
        return Expense.insertMany(expenses);
    }).then((result) => {
        done();
    }).catch((err) => {
        done(err);
    });
};
module.exports = {
    users,
    populateUsers,
    expenses,
    populateExpense,
};
