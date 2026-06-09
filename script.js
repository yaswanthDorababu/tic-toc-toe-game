const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let circleTurn;

startGame();

function startGame(){
  circleTurn = false; // X starts
  cells.forEach(cell => {
    cell.classList.remove('x','o');
    cell.classList.remove('win');
    cell.textContent = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHover();
  statusEl.textContent = `X's turn`;
}

function handleClick(e){
  const cell = e.target;
  const currentClass = circleTurn ? 'o' : 'x';
  placeMark(cell, currentClass);
  const winCombo = checkWin(currentClass);
  if(winCombo){
    endGame(false, currentClass, winCombo);
  } else if(isDraw()){
    endGame(true);
  } else {
    circleTurn = !circleTurn;
    setBoardHover();
    statusEl.textContent = circleTurn ? `O's turn` : `X's turn`;
  }
}

function placeMark(cell, cls){
  cell.classList.add(cls);
  // show visible mark text
  cell.textContent = cls === 'x' ? 'X' : 'O';
  cell.setAttribute('aria-label', cls === 'x' ? 'X' : 'O');
}

function setBoardHover(){
  board.classList.remove('x','o');
  board.classList.add(circleTurn ? 'o' : 'x');
}

function checkWin(cls){
  const cellsArr = Array.from(cells);
  for(const combo of WIN_COMBINATIONS){
    if(combo.every(i => cellsArr[i].classList.contains(cls))){
      return combo;
    }
  }
  return null;
}

function isDraw(){
  return [...cells].every(cell => cell.classList.contains('x') || cell.classList.contains('o'));
}

function endGame(draw, winnerClass, combo){
  if(draw){
    statusEl.textContent = `Draw!`;
  } else {
    statusEl.textContent = `${winnerClass === 'x' ? 'X' : 'O'} wins!`;
    if(combo){
      combo.forEach(i => cells[i].classList.add('win'));
    }
  }
  // remove listeners so board is frozen
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

restartBtn.addEventListener('click', startGame);
