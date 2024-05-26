import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signIn({ email: 'example@example.com', password: 'password' });
    if (error) console.log('Error: ', error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log('Error: ', error.message);
  };

  return (
    <div className="App">
      {session ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signInWithEmail}>Sign In</button>
      )}
    </div>
  );
}

export default App;