import React, { useState } from 'react';
import './App.css'; // Make sure this line is here to apply animations

const App = () => {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [roundPoints, setRoundPoints] = useState(['', '', '', '']);
  const [winner, setWinner] = useState('');

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handlePointChange = (index, value) => {
    const updated = [...roundPoints];
    updated[index] = value;
    setRoundPoints(updated);
  };

  const handleSubmit = () => {
    const updatedScores = scores.map((score, i) => score + Number(roundPoints[i] || 0));
    setScores(updatedScores);
    setRoundPoints(['', '', '', '']);
    
    const reached = updatedScores.findIndex(score => score >= 20);
    if (reached !== -1) {
      setWinner(players[reached]);
    }
  };

  const handleReset = () => {
    setPlayers(['', '', '', '']);
    setScores([0, 0, 0, 0]);
    setRoundPoints(['', '', '', '']);
    setWinner('');
  };

  return (
    <div className="container">
      <h1>🂡 Chuchila Scoreboard</h1>

      {players.map((name, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder={`Player ${i + 1} name`}
            value={name}
            onChange={(e) => handleNameChange(i, e.target.value)}
          />
          <input
            type="number"
            placeholder="Kati Point Khaayo: "
            value={roundPoints[i]}
            onChange={(e) => handlePointChange(i, e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
      ))}

      <button onClick={handleSubmit} disabled={winner !== ''}>Submit Round</button>
      <button onClick={handleReset} style={{ marginLeft: '10px' }}>Newgame</button>

      <h2>Current Scores:</h2>
      <ul>
        {players.map((name, i) => (
          <li key={i}>
            {name || `Player ${i + 1}`}: {scores[i]} points
          </li>
        ))}
      </ul>

      {winner && (
        <h2 className="winner">🎉 Winner: {winner} </h2>
      )}
    </div>
  );
};

export default App;
