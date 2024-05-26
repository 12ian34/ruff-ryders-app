import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import SubmitScore from './SubmitScore';
import Scores from './Scores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/submit_score" component={SubmitScore} />
        <Route path="/scores" component={Scores} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;