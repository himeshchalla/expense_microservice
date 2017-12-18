import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenses: []
        };
    }

componentDidMount() {
    axios.get('/api/expense')
    .then((res) => {
        if(res.data.success === true){
            this.setState({ expenses: res.data.expenses });
        } else {
            console.log(res.data.message);
        }
    }).catch((err) => {
        // Unable to get expense
        console.log("error");
        console.log(err);
    });
}

  render() {
    return (
      <div class="container">
          <div class="panel panel-default">
              <div class="panel-heading">
                  <h3 class="panel-title">
                      Expense App
                  </h3>
              </div>
              <div class="panel-body">
                  <h4><Link to="/addExpense"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>Add Expense</Link></h4>
                  <table class="table table-stripe">
                      <thead>
                          <tr>
                              <th>Name</th>
                              <th>Amount</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.expenses.length > 0 ? (
                              this.state.expenses.map((expense) =>
                                  <tr>
                                      <td><Link to={`/viewExpense/${expense._id}`}>{expense.name}</Link></td>
                                      <td>{expense.amount}</td>
                                      <td>
                                          <Link to={`/viewExpense/${expense._id}`}>View</Link>
                                          &nbsp;&nbsp;&nbsp;&nbsp;
                                          <Link to={`/editExpense/${expense._id}`}>Edit</Link>
                                          &nbsp;&nbsp;&nbsp;&nbsp;
                                          <Link to={`/deleteExpense/${expense._id}`}>Delete</Link>
                                      </td>
                                  </tr>
                              )
                          ):(
                              <tr>
                                  <td colSpan="3">No expense records found</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    );
  }
}
export default App;
