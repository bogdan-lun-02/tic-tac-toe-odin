let game = {
  gameboard: [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ],
  logBoard: function () {
    console.log(this.gameboard.forEach(cell => console.log(cell))
    );
  },

}

const player1 = {
  symbol: 'X',
  makeTurn: function (x) {
    if (game.gameboard[x] !== '') {
      gameControl.switchActivePlayer();
      return;
    } else game.gameboard[x] = 'X';
    gameControl.currentChoice = x;
    gameControl.player1Choices += x;
  }
};

const player2 = {
  symbol: 'O',
  makeTurn: function (x) {
    if (game.gameboard[x] !== '') {
      gameControl.switchActivePlayer();
      return;
    } else game.gameboard[x] = 'O';
    gameControl.currentChoice = x;
    gameControl.player2Choices += x;
  }
};

const gameControl = {
  activePlayer: 'player1',
  currentChoice: '',
  player1Choices: '',
  player2Choices: '',
  gameOver: false,

  // checkPlayerChoice: function () {
  //   if (game.gameboard[this.currentChoice] === 'X' ||
  //     game.gameboard[this.currentChoice] === 'O'
  //   ) {
  //     this.gameTurn(this.currentChoice);
  //     this.switchActivePlayer();
  //   }
  //   else {
  //     this.activePlayer === 'player1' ? game.gameboard[this.currentChoice] = player1.symbol :
  //       game.gameboard[this.currentChoice] = player2.symbol
  //   }

  // },

  switchActivePlayer: function () {
    this.activePlayer === 'player1' ? this.activePlayer = 'player2' : this.activePlayer = 'player1';
  },

  gameTurn: function (x) {
    this.activePlayer === 'player1' ? player1.makeTurn(x) : player2.makeTurn(x);
    // gameControl.checkPlayerChoice();
    gameControl.checkForWin();
    gameControl.checkForTie();
    game.logBoard();
    displayControl.updateGrid();
    this.switchActivePlayer();
  },

  checkForWin: function () {
    let arr = (this.activePlayer === 'player1' ? this.player1Choices : this.player2Choices);
    const winCombinations = ['048', '246', '345', '012', '678', '036', '147', '258'];
    const intersection = winCombinations.find((element => element === arr));

    if (intersection) {
      this.alertWinner()
    } else return;
  },

  checkForTie: function () {
    if ((this.gameOver !== true) && !(game.gameboard.includes(''))) {
      alert('It is a tie');
      this.gameOver = true;
    }
  },

  alertWinner: function () {
    this.gameOver = true;
    alert(`${this.activePlayer} wins`);
  }
}

const displayControl = {

  renderGrid: function () {

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
  },

  updateGrid: function () {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      square.textContent = game.gameboard[square.dataset.indexNumber];
    })
  }

}

window.addEventListener('DOMContentLoaded', displayControl.renderGrid)

// Крестики-нолики - цель игры составить на игровом поле линию из трех символов по горизонтали, вертикали или диагонали.
// Один игрок может ставить крестики, другой - нолики. Кто первый составил линию, тот победил. Возможна ничья если никто не победил и все свободные места на поле закончились. Поле состоит из 9 клеток.

// Изначальная цель - построить логику игры. Отобразить игровое поле в консоли. Поле состоит из 9 клеток. Клетка может быть либо пустой, либо с крестиком, либо с ноликом.
// В игру играют player1 и player2. Один из них ставит крестики, другой - нолики. Игроки ходят по очереди. Первым ходит player1. player1 выбирает клетку для хода. Игра должна проверить, не занята ли уже эта клетка.

// После каждого сделанного хода игра должна проверять, не победил ли игрок который сделал ход. Игра проверит все ходы игрока и сравнит их с победными комбинациями.

// Отображение игры
// 1. Создать пустое поле для игры.
// 2. Нажатие на клетку должно менять значение в массиве
// 3. Поле должно перезагружаться и отображать значения из массива