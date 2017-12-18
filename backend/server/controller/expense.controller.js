const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const _ = require('lodash');
var {ObjectID} = require('mongodb');
var {Expense} = require('../model/expense');
var expenseRouter = express.Router();
expenseRouter.use(bodyParser.json());

/**
 * Add expense / Save expense route as a POST /
 * Save expense data
 * @object {expense}
 */
expenseRouter.post('/', (req, res, next) => {
    var body = _.pick(req.body, ['name', 'description', 'amount']);
    var expense = new Expense(body);
    expense.createdAt = moment().valueOf();
    expense.save().then((doc) => {
         // Expense saved successfully
         var response_data = {"success": true, "error": false, "expense":doc }
         res.status(200).json(response_data);
    }).catch((err) => {
        // Unable to save Expense
        res.status(400).send({"success": false, "error": true,"message":"Due to bad request unable to save expense data", "description":JSON.stringify(err)});
    });
});
/**
* Fetch expense route as a GET /expense
* Get expense
* @type {[type]}
*/
expenseRouter.get('/', (req, res) => {
    Expense.find({
    }).then(
        (expenses)=> {
            // expense fetched successfully and send it back as a response
            var response_data = {"success": true, "error": false, "expenses":expenses}
            res.status(200).json(response_data);
        },
        (err) => {
            // Bad request so sending bad response
            res.status(400).send({"success": false, "error": true,"message":"Due to bad request unable to get expense data", "description":JSON.stringify(err)});
        }
    );
});
/**
* Fetch individual expense route by expense id as a GET /expense/123456
* Get individual expense by id
* @type {[type]}
*/
expenseRouter.get('/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send({"success": false, "error": true,"message":"Invalid expense id", "description":""});
    }
    Expense.findOne({
        _id: id,
    }).then((expense) => {
        if(!expense) {
            res.status(404).send({"success": false, "error": true,"message":"Expense not found", "description":""});
        }
        var response_data = {"success": true, "error": false, "expense":expense}
        res.status(200).json(response_data);
    }).catch((err) => {
        res.status(400).send({"success": false, "error": true,"message":"Due to bad request unable to get expense data", "description":JSON.stringify(err)});
    });
});
/**
* Remove expense route as a DELETE /expense/:id
* Delete expense by id
* @type {[type]}
*/
expenseRouter.delete('/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send({"success": false, "error": true,"message":"Invalid expense id", "description":""});
    }
    Expense.findOneAndRemove({
        _id: id,
    }).then((expense) => {
        if(!expense) {
            res.status(404).send({"success": false, "error": true,"message":"Expense not found", "description":""});
        }
        var response_data = {"success": true, "error": false, "expense":expense}
        res.status(200).json(response_data);
    }).catch((err) => {
        res.status(400).send({"success": false, "error": true,"message":"Due to bad request unable to delete expense data", "description":JSON.stringify(err)});
    });
});
/**
* Update expense route as a PATCH /expense/:id
* Update expense by id
* @type {[type]}
*/
expenseRouter.patch('/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['name', 'amount', 'description' ]);
    var expense = new Expense(body);
    if(!ObjectID.isValid(id)) {
        res.status(404).send({"success": false, "error": true,"message":"Invalid expense id", "description":""});
    }
    Expense.findOneAndUpdate(
        {
            _id: id,
        },
        {$set:body},
        {new: true}
    ).then((expense) => {
        if(!expense) {
            res.status(400).send({"success": false, "error": true,"message":"Expense not found", "description":""});
        }
        var response_data = {"success": true, "error": false, "expense":expense}
        res.status(200).json(response_data);
    }).catch((error) => {
        res.status(400).send({"success": false, "error": true,"message":"Due to bad request unable to update expense data", "description":JSON.stringify(error)});
    });
});

module.exports = expenseRouter;
