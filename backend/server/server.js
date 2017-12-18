const config = require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const port = process.env.PORT || 3001;
// var {User} = require('./model/user');
// var {Expense} = require('./model/expense');
// var {authenticate} = require('./middleware/authenticate');
var users = require('./controller/user.controller');
var expense = require('./controller/expense.controller');
var app = express();
app.use(bodyParser.json());
app.use('/api/users',users);
app.use('/api/expense',expense);
/**
* Default route / page content
* Default page content
* @type {[type]}
*/
app.get('/', (req, res) => {
    res.status(200).send({
        "message":"Welcome to default route of this api, nothing here probably you need to navigate to some other route",
    });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});
app.listen(port,() => {
    console.log(`Server started on port : ${port}`);
});

module.exports = {app}
