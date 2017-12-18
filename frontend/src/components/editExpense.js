import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class editExpense extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expense: {},
      name: '',
      amount: 0,
      description: ''
    };
  }

  componentDidMount() {
    axios.get('/api/expense/'+this.props.match.params.id)
      .then((res) => {
          if(res.data.success === true){
              this.setState({ expense: res.data.expense });
              console.log(this.state.expense);
              console.log(this.state);
          } else {
              console.log(res.data.message);
          }
      }).catch((err) => {
          // Unable to get expense
          console.log("error");
          console.log(err);
      });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({expense:state.expense});
    //this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { name, amount, description } = this.state.expense;
    axios.patch('/api/expense/'+this.props.match.params.id, { name, amount, description })
      .then((res) => {
          if(res.data.success === true){
              this.props.history.push("/editExpense/"+this.props.match.params.id)
              this.setState({ expense: res.data.expense });
              console.log(this.state.expense);
              console.log(this.state);
          } else {
              console.log(res.data.message);
          }
      }).catch((err) => {
          // Unable to update expense
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
                      Edit Expense
                  </h3>
              </div>
              <div class="panel-body">
                  <h4><Link to={`/`}><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>Expense List</Link></h4>
                  <form onSubmit={this.onSubmit}>
                      <div class="form-group">
                          <label for="name">Name:</label>
                          <input type="text" class="form-control" id="name" name="name" value={this.state.expense.name} onChange={this.onChange} placeholder="Name" />
                      </div>
                      <div class="form-group">
                          <label for="amount">Amount:</label>
                          <input type="text" class="form-control" id="name" name="amount" value={this.state.expense.amount} onChange={this.onChange} placeholder="Amount" />
                      </div>
                      <div class="form-group">
                          <label for="description">Description:</label>
                          <input type="text" class="form-control" id="description" name="description" value={this.state.expense.description} onChange={this.onChange} placeholder="Description" />
                      </div>
                      <button type="submit" class="btn btn-default">Submit</button>
                  </form>
              </div>
          </div>
      </div>
    );
  }
}

export default editExpense;
