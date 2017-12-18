import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

class addExpense extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            amount: 0,
            description: ''
        };
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { name, amount, description } = this.state;
        axios.post('/api/expense', { name, amount, description })
        .then((result) => {
            this.props.history.push("/")
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { name, amount, description } = this.state;
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            ADD Expense
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>Expense List</Link></h4>
                        <form onSubmit={this.onSubmit}>
                            <div class="form-group">
                                <label for="name">Expense Name:</label>
                                <input type="text" class="form-control" id="name" name="name" value={name} onChange={this.onChange} placeholder="Expense Name" />
                            </div>
                            <div class="form-group">
                                <label for="amount">Expense Amount:</label>
                                <input type="text" class="form-control" id="amount" name="amount" value={amount} onChange={this.onChange} placeholder="Expense Amount" />
                            </div>
                            <div class="form-group">
                                <label for="description">Description:</label>
                                <textarea class="form-control" id="description" name="description" onChange={this.onChange} placeholder="Description" cols="80" rows="3">{description}</textarea>
                            </div>
                            <button type="submit" class="btn btn-default">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default addExpense;
