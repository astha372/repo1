const HUMAN = 'X';
const AI = 'O';
let board = Array(9).fill('');

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');

// Create board UI
function createBoard() {
  boardDiv.innerHTML = '';
  board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = "w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white flex items-center justify-center text-4xl font-bold border-2 border-gray-400 cursor-pointer hover:bg-blue-100 hover:scale-105 transform transition duration-300 ease-in-out rounded-lg";
    cellDiv.innerText = cell;
    cellDiv.addEventListener('click', () => makeMove(index));
    boardDiv.appendChild(cellDiv);
  });
}

function makeMove(index) {
  if (board[index] !== '' || checkWinner(board)) return;

  board[index] = HUMAN;
  createBoard();

  if (!checkWinner(board) && board.includes('')) {
    setTimeout(() => {
      const bestMove = getBestMove();
      board[bestMove] = AI;
      createBoard();
      let winner = checkWinner(board);
      if (winner) showResult(winner);
    }, 500);
  } else {
    let winner = checkWinner(board);
    if (winner) showResult(winner);
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = AI;
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  let result = checkWinner(board);
  if (result !== null) {
    const scores = { [HUMAN]: -1, [AI]: 1, 'tie': 0 };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = AI;
        let score = minimax(board, depth + 1, false, alpha, beta);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = HUMAN;
        let score = minimax(board, depth + 1, true, alpha, beta);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
}

function checkWinner(b) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b1, c] = pattern;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }

  if (!b.includes('')) return 'tie';
  return null;
}

function showResult(winner) {
  if (winner === 'tie') {
    statusDiv.innerText = "🤝 It's a Tie!";
    statusDiv.className = "text-2xl font-bold mt-6 text-gray-700 animate__animated animate__fadeInUp";
  } else if (winner === HUMAN) {
    statusDiv.innerText = "🎉 You Win!";
    statusDiv.className = "text-2xl font-bold mt-6 text-green-600 animate__animated animate__bounceIn";
  } else {
    statusDiv.innerText = "💻 AI Wins!";
    statusDiv.className = "text-2xl font-bold mt-6 text-red-600 animate__animated animate__shakeX";
  }
}

function restartGame() {
  board = Array(9).fill('');
  createBoard();
  statusDiv.innerText = '';
}

createBoard();
