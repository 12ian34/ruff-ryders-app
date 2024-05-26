import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { supabase } from './supabaseClient';

function SubmitScore() {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('scores').insert([{ player1_id: player1Id, player2_id: player2Id, score1, score2 }]);
    alert('Score submitted');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Score
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Player 1 ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={player1Id}
          onChange={(e) => setPlayer1Id(e.target.value)}
        />
        <TextField
          label="Player 2 ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={player2Id}
          onChange={(e) => setPlayer2Id(e.target.value)}
        />
        <TextField
          label="Score 1"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
        />
        <TextField
          label="Score 2"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Score
        </Button>
      </form>
    </Container>
  );
}

export default SubmitScore;