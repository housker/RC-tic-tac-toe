class Game {
  constructor() {
    this.assignments = {
      current: 'X',
      remaining: new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]),
      squares: new Array(9).fill(['', 0, undefined])
    }
    this.domElements = {
      container: document.createElement('div'),
      subheading: document.createElement('h3'),
      line: document.createElement('div'),
      board: document.createElement('table'),
      reset: document.createElement('div'),
    }
  }

  checkWinner(index) {
    let winner = this.assignments.current === 'X' ? 'O' : 'X';
    if(Math.abs(this.sumColumn(index)[0]) === 3) {
      let result = this.sumColumn(index);
      let x1 = result[1].x + 50;
      let y1 = result[1].y + 75;
      let x2 = result[2].x + 50;
      let y2 = result[2].y + 25;
      this.drawLine(x1, y1, x2, y2);
      this.assignments.current = 'win';
      return winner;
    } else if(Math.abs(this.sumRow(index)[0]) === 3) {
      let result = this.sumRow(index);
      let x1 = result[1].x + 75;
      let y1 = result[1].y + 45;
      let x2 = result[2].x + 25;
      let y2 = result[2].y + 45;
      this.drawLine(x1, y1, x2, y2);
      this.assignments.current = 'win';
      return winner;
    } else if(Math.abs(this.sumLDiagonal()[0]) === 3) {
      let result = this.sumLDiagonal();
      let x1 = result[1].x + 40;
      let y1 = result[1].y + 40;
      let x2 = result[2].x + 50;
      let y2 = result[2].y + 50;
      this.drawLine(x1, y1, x2, y2);
      this.assignments.current = 'win';
      return winner;
    } else if(Math.abs(this.sumRDiagonal()[0]) === 3) {
      let result = this.sumRDiagonal();
      let x1 = result[1].x + 50;
      let y1 = result[1].y + 40;
      let x2 = result[2].x + 40;
      let y2 = result[2].y + 50;
      this.drawLine(x1, y1, x2, y2);
      this.assignments.current = 'win';
      return winner;
    }
  }

  drawLine(x1,y1, x2,y2){
    let left = x1/window.innerWidth * 100;
    let length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    let angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    let transform = 'rotate('+angle+'deg)';
    this.domElements.line.setAttribute(`style`, `width: ${length}px; transform: ${transform}; left: ${left}%; top: ${y1}px; position: fixed; transform-origin: 0 100%; height: 2px; background: #000; z-index: 10`);
  }

  init(div) {
    this.domElements.reset.classList.add('reset');
    this.domElements.reset.innerText = 'Reset';
    div.appendChild(this.domElements.container);
    this.domElements.container.appendChild(this.domElements.subheading);
    this.domElements.container.appendChild(this.domElements.line);
    this.domElements.container.appendChild(this.domElements.board);
    this.domElements.container.appendChild(this.domElements.reset);
    this.assignments.squares.forEach((sqr, i) => {
      if(i % 3 === 0) {
      let row = document.createElement('tr')
      row.setAttribute('id', Math.floor(i / 3));
      this.domElements.board.appendChild(row);
      }
      let column = document.createElement('td');
      column.innerHTML = `<button id="${i}"></button>`;
      this.domElements.board.lastChild.appendChild(column);
    })
    this.domElements.squares = document.getElementsByTagName('button');

    this.updateDom();
    this.domElements.reset.addEventListener('click', () => this.reset());
    for(let square of this.domElements.squares) {
      square.addEventListener('click', e => this.takeTurn(e.target))
    }
  }

  reset(dom, playing, pieces) {
    this.assignments.current = 'X';
    this.assignments.remaining = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    this.assignments.squares = new Array(9).fill(['', 0, undefined]);
    this.updateDom();
  }

  sumColumn(i) {
    let a = (i + 3) % 9;
    let b = (i + 6) % 9;
    let cSquares = [i, a, b].sort((a, b) => {
      if(a < b) {
        return 1;
      } else {
        return -1;
      }
    });
    let sum = this.assignments.squares[i][1] + this.assignments.squares[(i + 3) % 9][1] + this.assignments.squares[(i + 6) % 9][1];
    return [sum, this.assignments.squares[cSquares[0]][2], this.assignments.squares[cSquares[2]][2]];
  }

  sumLDiagonal() {
    let sum = this.assignments.squares[0][1] + this.assignments.squares[4][1] + this.assignments.squares[8][1];
    return [sum, this.assignments.squares[0][2], this.assignments.squares[8][2]];
  }

  sumRDiagonal() {
    let sum = this.assignments.squares[2][1] + this.assignments.squares[4][1] + this.assignments.squares[6][1];
    return [sum, this.assignments.squares[2][2], this.assignments.squares[6][2]];
  }

  sumRow(i) {
    let rSquares = [i, Math.floor(i / 3) * 3 + (i + 2) % 3, Math.floor(i / 3) * 3 + (i + 1) % 3].sort((a, b) => {
      if(a < b) {
        return 1;
      } else {
        return -1;
      }
    });
    let sum = this.assignments.squares[i][1] + this.assignments.squares[(Math.floor(i / 3) * 3 + (i + 2) % 3)][1] + this.assignments.squares[(Math.floor(i / 3) * 3 + (i + 1) % 3)][1];
    return [sum, this.assignments.squares[rSquares[0]][2], this.assignments.squares[rSquares[2]][2]];
  }

  takeTurn(square) {
    if(!this.assignments.squares[square.id][0] && this.assignments.current !== 'win') {
      this.updateAssignments(square);
      let winner = this.checkWinner(parseInt(square.id))
      this.updateDom(winner);
    }
  }

  updateAssignments(square) {
    let values = {
      X: 1,
      O: -1
    }
    this.assignments.remaining.delete(parseInt(square.id));
    this.assignments.squares[square.id] = [this.assignments.current, values[this.assignments.current], square.getBoundingClientRect()];
    this.assignments.current = this.assignments.current === 'X' ? 'O' : 'X';
  }

  updateDom(winner) {
    this.assignments.squares.map((sqr, i) => this.domElements.squares[i].innerText = sqr[0]);
    if(winner) {
      this.domElements.subheading.innerHTML = `<div id="winner">Winner: ${winner}</div>`;
    } else if(!this.assignments.remaining.size) {
      this.domElements.subheading.innerHTML = `<div id="draw">DRAW</div>`;
    } else {
      this.domElements.subheading.innerHTML = `Current Player: <strong id="current">${this.assignments.current}</strong>`;
      this.domElements.line.setAttribute(`style`, `height: 0px;`);
    }
  }
}

window.onload = () => {
  let game = new Game();
  game.init(document.getElementById('boards'));
}
