import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [roundPoints, setRoundPoints] = useState(['', '', '', '']);
  const [winner, setWinner] = useState('');
  const [roundHistory, setRoundHistory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load past games on first render
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('chuchila_games')) || [];
    setGameHistory(stored);
  }, []);

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
    const parsedRound = roundPoints.map(val => Number(val || 0));
    const updatedScores = scores.map((score, i) => score + parsedRound[i]);

    setScores(updatedScores);
    setRoundPoints(['', '', '', '']);
    setRoundHistory(prev => [...prev, parsedRound]);

    const reached = updatedScores.findIndex(score => score >= 20);
    if (reached !== -1) {
      const winnerName = players[reached];
      setWinner(winnerName);

      const timestamp = new Date().toLocaleString();
      const gameRecord = {
        players: [...players],
        scores: [...updatedScores],
        winner: winnerName,
        time: timestamp,
        roundHistory: [...roundHistory, parsedRound],
      };

      const updatedHistory = [gameRecord, ...gameHistory].slice(0, 5);
      setGameHistory(updatedHistory);
      localStorage.setItem('chuchila_games', JSON.stringify(updatedHistory));
    }
  };

  const handleReset = () => {
    setScores([0, 0, 0, 0]);
    setRoundPoints(['', '', '', '']);
    setWinner('');
    setRoundHistory([]);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '180px', background: '#0a2a43', color: '#fff', height: '100vh', padding: '20px 10px' }}>
        <h2 style={{ fontSize: '1.2em' }}>📋 Menu</h2>
        <button
          style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#0072ff', color: '#fff', border: 'none', borderRadius: '6px' }}
          onClick={() => setShowHistory(false)}
        >
          🏠 Home
        </button>
        <button
          style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#0072ff', color: '#fff', border: 'none', borderRadius: '6px' }}
          onClick={() => setShowHistory(true)}
        >
          🏛️ History
        </button>
      </div>

      {/* Main Content */}
      <div className="container" style={{ flex: 1 }}>
        {!showHistory && (
          <>
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
                  placeholder="Points this round"
                  value={roundPoints[i]}
                  onChange={(e) => handlePointChange(i, e.target.value)}
                  style={{ marginLeft: '10px' }}
                />
              </div>
            ))}

            <button onClick={handleSubmit} disabled={winner !== ''}>Submit Round</button>
            <button onClick={handleReset} style={{ marginLeft: '10px' }}>New Game</button>

            <h2>Current Scores:</h2>
            <ul>
              {players.map((name, i) => (
                <li key={i}>
                  {name || `Player ${i + 1}`}: {scores[i]} points
                </li>
              ))}
            </ul>

            {winner && (
              <h2 className="winner"> Winner is: {winner} </h2>
            )}

            {roundHistory.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3> Round wise Score:</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', color: '#fff' }}>
                  <thead>
                    <tr>
                      <th>Round</th>
                      {players.map((p, i) => (
                        <th key={i}>{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roundHistory.map((round, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        {round.map((score, i) => (
                          <td key={i}>{score}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showHistory && (
          <div>
            <h2>📚 Past Games (Last 5)</h2>
            {gameHistory.map((game, idx) => (
              <div key={idx} style={{ marginBottom: '30px', background: '#222', padding: '15px', borderRadius: '10px' }}>
                <h4>Game on {game.time} - Winner: 🏆 {game.winner}</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                  <thead>
                    <tr>
                      <th>Round</th>
                      {game.players.map((p, i) => (
                        <th key={i}>{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {game.roundHistory.map((round, rIdx) => (
                      <tr key={rIdx}>
                        <td>{rIdx + 1}</td>
                        {round.map((score, i) => (
                          <td key={i}>{score}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
