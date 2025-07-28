import React, { useState, useEffect } from 'react';
import './App.css';

// Theme colors (provided in project description)
const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  accent: '#FFC107',
  lightBoard: '#f6f9fc',
  boardBorder: '#ececec',
  winHighlight: '#C8E6C9'
};

/**
 * PUBLIC_INTERFACE
 * Renders a single tic tac toe square/button.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-square-highlight' : ''}`}
      onClick={onClick}
      aria-label={`Cell: ${value ? value : "Empty"}`}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Renders the tic tac toe game board.
 */
function Board({ squares, onClick, winningLine }) {
  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onClick(idx)}
                highlight={winningLine && winningLine.includes(idx)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Calculates the winner and the winning line from the board state.
 * @returns { winner: 'X'|'O'|null, line: number[]|null }
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a,b,c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * PUBLIC_INTERFACE
 * Main App: manages state and renders the full tic tac toe UI.
 */
function App() {
  // 'X' always starts
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [status, setStatus] = useState('Next: X');
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [gameOver, setGameOver] = useState(false);

  // Recalculate winner & status when board changes
  useEffect(() => {
    const { winner, line } = calculateWinner(squares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      setWinnerInfo({ winner, line });
      setGameOver(true);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (squares.every(Boolean)) {
      setStatus("It's a draw!");
      setWinnerInfo({ winner: null, line: null });
      setGameOver(true);
    } else {
      setStatus(`Next: ${xIsNext ? 'X' : 'O'}`);
      setWinnerInfo({ winner: null, line: null });
      setGameOver(false);
    }
  // Only recalculate if squares array changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares]);

  // PUBLIC_INTERFACE
  // Handles clicking a square
  function handleSquareClick(idx) {
    if (gameOver || squares[idx]) return; // Ignore if game over or taken
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(prev => !prev);
  }

  // PUBLIC_INTERFACE
  // Starts a new game, keeping score
  function handleResetBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus('Next: X');
    setWinnerInfo({ winner: null, line: null });
    setGameOver(false);
  }

  // PUBLIC_INTERFACE
  // Resets all scores
  function handleFullReset() {
    handleResetBoard();
    setScores({ X: 0, O: 0 });
  }

  return (
    <div className="ttt-app-bg" style={{minHeight: '100vh'}}>
      <main className="ttt-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary }}>Tic Tac Toe</h1>
        <div className="ttt-status-score">
          <div className="ttt-status" aria-live="polite">{status}</div>
          <div className="ttt-score-row">
            <span className="ttt-score ttt-score-x" style={{ color: COLORS.primary }}>X: {scores.X}</span>
            <span className="ttt-score ttt-score-o" style={{ color: COLORS.secondary }}>O: {scores.O}</span>
          </div>
        </div>
        <Board
          squares={squares}
          onClick={handleSquareClick}
          winningLine={winnerInfo.line}
        />
        <div className="ttt-buttons">
          <button className="ttt-btn ttt-btn-primary" onClick={handleResetBoard} disabled={!gameOver}>
            New Game
          </button>
          <button className="ttt-btn ttt-btn-secondary" onClick={handleFullReset}>
            Reset All
          </button>
        </div>
        <div className="ttt-credit">
          <small>
            Styled with <span style={{color: COLORS.accent, fontWeight: 600}}>#2196F3</span>, <span style={{color: COLORS.secondary, fontWeight: 600}}>#4CAF50</span>, <span style={{color: COLORS.accent, fontWeight: 600}}>#FFC107</span>
          </small>
        </div>
      </main>
    </div>
  );
}

export default App;
