import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import SubmitScore from './SubmitScore';
import Scores from './Scores';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/submit_score" component={SubmitScore} />
        <Route path="/scores" component={Scores} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;