import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function SubmitScore() {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const submitScore = async () => {
    const { data, error } = await supabase
      .from('scores')
      .insert([{ player1_id: player1Id, player2_id: player2Id, score1, score2 }]);
    if (error) console.log('Error: ', error.message);
    else console.log('Score submitted: ', data);
  };

  return (
    <div>
      <input type="text" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)} placeholder="Player 1 ID" />
      <input type="text" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)} placeholder="Player 2 ID" />
      <input type="number" value={score1} onChange={(e) => setScore1(e.target.value)} placeholder="Score 1" />
      <input type="number" value={score2} onChange={(e) => setScore2(e.target.value)} placeholder="Score 2" />
      <button onClick={submitScore}>Submit Score</button>
    </div>
  );
}

export default SubmitScore;