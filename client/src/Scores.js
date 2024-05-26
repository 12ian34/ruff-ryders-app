import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { supabase } from './supabaseClient';

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchScores();

    // Subscribe to real-time updates
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
    const { data } = await supabase
      .from('scores')
      .select('*');
    setScores(data);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Live Scores
      </Typography>
      <List>
        {scores.map((score) => (
          <ListItem key={score.id}>
            <ListItemText
              primary={`Player 1 ID: ${score.player1_id}, Score: ${score.score1} - Player 2 ID: ${score.player2_id}, Score: ${score.score2}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Scores;
