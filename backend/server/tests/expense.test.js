const expect = require('expect');
const request = require('supertest');
const moment = require('moment');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {users,
    populateUsers,
    expenses,
    populateExpense,
    } = require('./seed/seed');
const {Expense} = require('./../model/expense');

// Used to perform task before each test case run
beforeEach(populateUsers);
beforeEach(populateExpense);
/**
 * Test cases for POST /Inventory
 * @param  {[type]} POST [description]
 * @param  {[type]} it   [description]
 * @return {[type]}      [description]
 */
describe('POST /api/expense', () => {
    it('It should create a new expense', (done) => {
        var expenseData = {
            "name": "Expense11111111",
            "description":"Testing Expense1 for success test case 1",
            "amount":5,
            "createdAt": moment().valueOf(),
            "updatedAt": moment().valueOf(),
        };
        request(app)
        .post('/api/expense')
        .send(expenseData)
        .expect(200)
        .expect((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.error).toBe(false);
            expect(response.body.expense).toBeA("object");
            expect(response.body.expense._id).toExist();
            expect(response.body.expense.name).toBe("Expense11111111");
            expect(response.body.expense.amount).toExist(5);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }
            Expense.findOne({"name": "Expense11111111", "amount":5, "description":"Testing Expense1 for success test case 1"}).then((expense) => {
                expect(expense).toExist();
                expect(expense.name).toBe("Expense11111111");
                expect(expense.amount).toBe(5);
                expect(expense.description).toBe("Testing Expense1 for success test case 1");
                done();
            }).catch((err) => done(err));
        });
    });

    it('It should not create a new expense for bad data', (done) => {
        var expenseData = {
            "name": "E",
            "description":"Testing Expense2 for success test case 2",
            "amount":"test",
            "createdAt": moment().valueOf(),
            "updatedAt": moment().valueOf(),
        };
        request(app)
        .post('/api/expense')
        .send(expenseData)
        .expect(400)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.description).toExist();
            expect(response.body.expense).toNotExist();
        })
        .end(done());
    });
});

describe("GET /api/expense", () => {
    it("It should fetch all expense items", (done) => {
        request(app)
        .get('/api/expense')
        .expect(200)
        .expect((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.error).toBe(false);
            expect(response.body.expenses.length).toBe(expenses.length);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Expense.find().then((expensedata) => {
                expect(expensedata.length).toBe(expenses.length);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });
});
describe("GET /api/expense/:id", () => {
    it("It should return a expense data by id", (done) => {
        request(app)
        .get(`/api/expense/${expenses[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.error).toBe(false);
            expect(response.body.expense).toBeA("object");
            expect(response.body.expense._id).toBe(expenses[0]._id.toHexString());
            expect(response.body.expense.name).toBe(expenses[0].name);
            expect(response.body.expense.amount).toBe(expenses[0].amount);
        })
        .end(done);
    });

    it("It should return a 404 for non-existing expense by id", (done) => {
        request(app)
        .get(`/api/expense/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.expense).toNotExist();
        })
        .end(done);
    });

    it("It should return a 404 for non-object ids", (done) => {
        request(app)
        .get(`/api/expense/${'123'}`)
        .expect(404)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
           expect(response.body.message).toExist();
           expect(response.body.expense).toNotExist();
        })
        .end(done);
    });
});
describe("DELETE /api/expense/:id", () => {
    it("It should remove a expense by id", (done) => {
        var hexId = expenses[0]._id.toHexString();
        request(app)
        .delete(`/api/expense/${hexId}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.error).toBe(false);
            expect(response.body.expense).toBeA("object");
            expect(response.body.expense._id).toBe(expenses[0]._id.toHexString());
            expect(response.body.expense.name).toBe(expenses[0].name);
            expect(response.body.expense.amount).toBe(expenses[0].amount);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Expense.findById(hexId).then((expense) => {
                expect(expense).toNotExist();
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it("It should return a 404 for if inventory item id not found", (done) => {
        request(app)
        .delete(`/api/expense/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.expense).toNotExist();
        })
        .end(done);
    });

    it("It should return a 404 for object id is invalid", (done) => {
        request(app)
        .delete(`/api/expense/123`)
        .expect(404)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.expense).toNotExist();
        })
        .end(done);
    });
});
describe("PATCH /api/expense/:id", () => {
    it("It should update a expense by id", (done) => {
        var hexId = expenses[0]._id.toHexString();
        var body = {
            "name": "Test Expense22222222222222",
            "amount":754,
            "description":"abcdefghijklmnopqurstuvwxyz",
        };
        request(app)
        .patch(`/api/expense/${hexId}`)
        .send(body)
        .expect(200)
        .expect((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.error).toBe(false);
            expect(response.body.expense).toBeA("object");
            expect(response.body.expense._id).toBe(hexId);
            expect(response.body.expense.name).toBe("Test Expense22222222222222");
            expect(response.body.expense.amount).toBe(754);
            expect(response.body.expense.description).toBe("abcdefghijklmnopqurstuvwxyz");
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Expense.findOne({"_id": hexId}).then((expense) => {
                expect(expense).toExist();
                expect(expense.name).toBe("Test Expense22222222222222");
                expect(expense.amount).toBe(754);
                expect(expense.description).toBe("abcdefghijklmnopqurstuvwxyz");
            }).catch((err) => done(err));
            done();
        });
    });

    it("It should not update a expense having invalid data in request body", (done) => {
        var hexId = expenses[0]._id.toHexString();
        var body = {
            "name": "T",
            "amount":"sdfdsf",
            "description":"abcdefghijklmnopqurstuvwxyz",
        };
        request(app)
        .patch(`/api/expense/${hexId}`)
        .send(body)
        .expect(400)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.description).toExist();
            expect(response.body.expense).toNotExist();
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            done();
        });
    });

    it("It should not update a expense having invalid id", (done) => {
        var hexId = '123456789';
        var body = {
            "name": "Tddddddddddddddd",
            "amount":555,
            "description":"abcdefghijklmnopqurstuvwxyz",
        };
        request(app)
        .patch(`/api/expense/${hexId}`)
        .send(body)
        .expect(404)
        .expect((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toExist();
            expect(response.body.description).toBe('');
            expect(response.body.expense).toNotExist();
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            done();
        });
    });
});
