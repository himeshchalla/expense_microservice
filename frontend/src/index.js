import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap-theme.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import editExpense from './components/editExpense';
import addExpense from './components/addExpense';
import viewExpense from './components/viewExpense';

ReactDOM.render(
  <Router>
      <div>
          <Route exact path='/' component={App} />
          <Route path='/editExpense/:id' component={editExpense} />
          <Route path='/addExpense' component={addExpense} />
          <Route path='/viewExpense/:id' component={viewExpense} />
      </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
