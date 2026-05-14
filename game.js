(function () {
  "use strict";

  var CELL = 20;
  var COLS = 20;
  var ROWS = 20;
  var STEP_MS = 120;

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.equals = function (other) {
    return this.x === other.x && this.y === other.y;
  };

  Point.prototype.copy = function () {
    return new Point(this.x, this.y);
  };

  function Snake(startX, startY, length) {
    var i;
    this.segments = [];
    for (i = 0; i < length; i += 1) {
      this.segments.push(new Point(startX - i, startY));
    }
    this.dirX = 1;
    this.dirY = 0;
    this.pendingDirX = 1;
    this.pendingDirY = 0;
    this.growPending = 0;
  }

  Snake.prototype.queueDirection = function (dx, dy) {
    if (this.dirX + dx === 0 && this.dirY + dy === 0) {
      return;
    }
    this.pendingDirX = dx;
    this.pendingDirY = dy;
  };

  Snake.prototype.step = function () {
    var head;
    var newHead;
    var tail;
    var i;
    this.dirX = this.pendingDirX;
    this.dirY = this.pendingDirY;
    head = this.segments[0];
    newHead = new Point(head.x + this.dirX, head.y + this.dirY);
    this.segments.unshift(newHead);
    if (this.growPending > 0) {
      this.growPending -= 1;
    } else {
      this.segments.pop();
    }
  };

  Snake.prototype.head = function () {
    return this.segments[0];
  };

  Snake.prototype.grow = function (n) {
    this.growPending += typeof n === "number" ? n : 1;
  };

  Snake.prototype.hitsSelf = function () {
    var h = this.head();
    var i;
    for (i = 1; i < this.segments.length; i += 1) {
      if (h.equals(this.segments[i])) {
        return true;
      }
    }
    return false;
  };

  function Game(canvas, scoreEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scoreEl = scoreEl;
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.running = false;
    this.lastTick = 0;
    this.accum = 0;
    this.boundKeydown = this.onKeydown.bind(this);
    this.boundLoop = this.loop.bind(this);
  }

  Game.prototype.randomEmptyCell = function () {
    var occupied;
    var x;
    var y;
    var tries;
    var s;
    var i;
    for (tries = 0; tries < 500; tries += 1) {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      occupied = false;
      s = this.snake.segments;
      for (i = 0; i < s.length; i += 1) {
        if (s[i].x === x && s[i].y === y) {
          occupied = true;
          break;
        }
      }
      if (!occupied) {
        return new Point(x, y);
      }
    }
    return new Point(0, 0);
  };

  Game.prototype.reset = function () {
    this.snake = new Snake(Math.floor(COLS / 2), Math.floor(ROWS / 2), 3);
    this.food = this.randomEmptyCell();
    this.score = 0;
    this.running = true;
    this.lastTick = 0;
    this.accum = 0;
    this.updateScore();
  };

  Game.prototype.updateScore = function () {
    this.scoreEl.textContent = "Score: " + this.score;
  };

  Game.prototype.onKeydown = function (e) {
    var key = e.keyCode;
    if (key === 37) {
      e.preventDefault();
      this.snake.queueDirection(-1, 0);
    } else if (key === 38) {
      e.preventDefault();
      this.snake.queueDirection(0, -1);
    } else if (key === 39) {
      e.preventDefault();
      this.snake.queueDirection(1, 0);
    } else if (key === 40) {
      e.preventDefault();
      this.snake.queueDirection(0, 1);
    }
  };

  Game.prototype.tick = function () {
    var head;
    this.snake.step();
    head = this.snake.head();
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      this.running = false;
      return;
    }
    if (this.snake.hitsSelf()) {
      this.running = false;
      return;
    }
    if (head.equals(this.food)) {
      this.snake.grow(1);
      this.score += 1;
      this.updateScore();
      this.food = this.randomEmptyCell();
    }
  };

  Game.prototype.draw = function () {
    var ctx = this.ctx;
    var s = this.snake.segments;
    var i;
    var seg;
    var f = this.food;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    for (i = 0; i <= COLS; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, ROWS * CELL);
      ctx.stroke();
    }
    for (i = 0; i <= ROWS; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(COLS * CELL, i * CELL + 0.5);
      ctx.stroke();
    }
    ctx.fillStyle = "#c94c4c";
    ctx.fillRect(f.x * CELL + 1, f.y * CELL + 1, CELL - 2, CELL - 2);
    for (i = 0; i < s.length; i += 1) {
      seg = s[i];
      ctx.fillStyle = i === 0 ? "#6ecf6e" : "#4a9f4a";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    }
    if (!this.running) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game over — refresh to play again", this.canvas.width / 2, this.canvas.height / 2);
    }
  };

  Game.prototype.loop = function (now) {
    if (this.lastTick === 0) {
      this.lastTick = now;
    }
    this.accum += now - this.lastTick;
    this.lastTick = now;
    while (this.accum >= STEP_MS && this.running) {
      this.tick();
      this.accum -= STEP_MS;
    }
    this.draw();
    window.requestAnimationFrame(this.boundLoop);
  };

  Game.prototype.start = function () {
    this.reset();
    window.addEventListener("keydown", this.boundKeydown, false);
    window.requestAnimationFrame(this.boundLoop);
  };

  var canvas = document.getElementById("board");
  var scoreEl = document.getElementById("score");
  var game = new Game(canvas, scoreEl);
  game.start();
}());
