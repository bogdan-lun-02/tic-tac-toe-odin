// Фабричные функции

function createPlayer(name, symbol, id) {

  let score = 0;

  const makeTurn = (x) => {
    if (game.gameboard[x] !== '') {
      gameControl.switchActivePlayer();
      return;
    } else game.gameboard[x] = symbol;
    gameControl.currentChoice = x;
    id === 1 ? gameControl.player1Choices += x :
      gameControl.player2Choices += x
  }
  return { name, makeTurn, score }
}

const player1 = createPlayer('player1', 'X', 1);
const player2 = createPlayer('player2', 'O', 2);

// IIFE

const game = (function () {

  let gameboard = ['', '', '', '', '', '', '', '', ''];

  const processForm = (e) => {
    e.preventDefault();
    player1.name = document.querySelector('#firstp').value;
    player2.name = document.querySelector('#secondp').value;

    displayControl.renderGrid();
    displayControl.showInfo();
    const form = document.querySelector('.form');
    form.remove();
  }

  const nextRound = function () {
    document.querySelector('.container').innerHTML = '';
    gameboard.fill('');
    console.log(gameboard);
    gameControl.activePlayer = player1;
    gameControl.currentChoice = '';
    gameControl.player1Choices = '';
    gameControl.player2Choices = '';
    gameControl.gameOver = false;
    gameControl.tie = false;
    document.querySelector('.players').textContent = '';
    displayControl.renderGrid();
    displayControl.showInfo();

    document.querySelector('.container').style.pointerEvents = 'initial';
  }

  const restartGame = function () {
    location.reload();
  }

  return { gameboard, processForm, nextRound, restartGame }
})();

const gameControl = (function () {
  let activePlayer = player1;
  let currentChoice = '';
  let player1Choices = '';
  let player2Choices = '';
  let gameOver = false;
  let tie = false;

  const switchActivePlayer = function () {
    this.activePlayer === player1 ? this.activePlayer = player2 : this.activePlayer = player1;
  }
  const gameTurn = function (x) {
    this.activePlayer === player1 ? player1.makeTurn(x) : player2.makeTurn(x);
    gameControl.checkForWin();
    gameControl.checkForTie();
    displayControl.updateGrid();
    displayControl.showInfo();
    this.switchActivePlayer();
  }
  const checkForWin = function () {
    let arr = (this.activePlayer === player1 ? this.player1Choices : this.player2Choices);

    const winCombinations = ['048', '246', '345', '012', '678', '036', '147', '258'];
    const intersection = winCombinations.find(combination => {

      let counter = 0;
      let comb = combination.split("");

      for (let i = 0; i < 3; i++) {
        if (arr.includes(comb[i])) {
          counter++;
        }
      }

      if (counter === 3) {
        return true;
      } else return false;
    });

    if (intersection) {
      displayControl.crossLine(intersection);
      this.gameOver = true;
      this.activePlayer.score++;
      displayControl.disableControls();
    } else return;
  };

  const checkForTie = function () {
    if ((this.gameOver !== true) && !(game.gameboard.includes(''))) {
      this.gameOver = true;
      this.tie = true;
      displayControl.showInfo();
      displayControl.disableControls();
    }
  }
  return { activePlayer, currentChoice, player1Choices, player2Choices, gameOver, tie, switchActivePlayer, gameTurn, checkForWin, checkForTie }
})();

const displayControl = (function () {

  const renderGrid = function () {

    for (let i = 0; i < 3; i++) {
      document.querySelector('#container').appendChild(document.createElement('div')).
        classList.add('row');
    }

    const rows = document.querySelectorAll('.row');
    rows.forEach((row) => {
      for (let i = 0; i < 3; i++) {
        row.appendChild(document.createElement('div')).
          classList.add('square');
      }
    })

    const squares = document.querySelectorAll('.square');
    let index = 0;
    squares.forEach(square => {
      square.setAttribute('data-index-number', index);
      index++;
      square.addEventListener('click', (e) => {
        gameControl.gameTurn(e.target.dataset.indexNumber);
      })
    })
  }

  const updateGrid = function () {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      square.textContent = game.gameboard[square.dataset.indexNumber];
    })
  }

  const disableControls = function () {
    const container = document.querySelector('.container');
    container.style.pointerEvents = 'none';
  }

  const crossLine = function (inter) {
    let crossedLine = inter.split('');
    console.log(crossedLine);
    crossedLine.forEach(crossed => {
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
        if (square.dataset.indexNumber === crossed) {
          square.style.backgroundColor = 'black';
          square.style.color = 'white';
        }
      })
    })
  }

  const showInfo = function () {
    const info = document.querySelector('.info');
    const players = document.querySelector('.players');

    players.textContent = `Players: ${player1.name}, ${player2.name}`;

    if (gameControl.gameOver === true && gameControl.tie === false) {
      players.textContent = `${gameControl.activePlayer.name} wins. Score: ${player1.score} : ${player2.score}`
    } else if (gameControl.gameOver === true && gameControl.tie === true) {
      players.textContent = `It is a tie`;
    }
  }
  return { renderGrid, updateGrid, disableControls, crossLine, showInfo }
}
)();


const formSubmitBtn = document.querySelector('#submit');
const nextRound = document.querySelector('#next');
const restartGame = document.querySelector('#restart');

formSubmitBtn.addEventListener('click', game.processForm);
nextRound.addEventListener('click', game.nextRound);
restartGame.addEventListener('click', game.restartGame);

