import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function LiveScores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchScores();
    const subscription = supabase
      .from('scores')
      .on('INSERT', payload => {
        setScores(prevScores => [payload.new, ...prevScores]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const fetchScores = async () => {
    const { data } = await supabase.from('scores').select('*');
    setScores(data);
  };

  return (
    <div>
      <h1>Live Scores</h1>
      {scores.map(score => (
        <div key={score.id}>
          <p>Player 1 ID: {score.player1_id}, Score: {score.score1}</p>
          <p>Player 2 ID: {score.player2_id}, Score: {score.score2}</p>
        </div>
      ))}
    </div>
  );
}

export default LiveScores;
