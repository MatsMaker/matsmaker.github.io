(function (global) {
  "use strict";

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.equals = function (other) {
    return this.x === other.x && this.y === other.y;
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

  function GameModel(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.running = false;
  }

  GameModel.prototype.randomEmptyCell = function () {
    var occupied;
    var x;
    var y;
    var tries;
    var s;
    var i;
    for (tries = 0; tries < 500; tries += 1) {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
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

  GameModel.prototype.reset = function () {
    this.snake = new Snake(
      Math.floor(this.cols / 2),
      Math.floor(this.rows / 2),
      3
    );
    this.food = this.randomEmptyCell();
    this.score = 0;
    this.running = true;
  };

  GameModel.prototype.queueDirection = function (dx, dy) {
    if (this.snake) {
      this.snake.queueDirection(dx, dy);
    }
  };

  GameModel.prototype.step = function () {
    var head;
    if (!this.running || !this.snake) {
      return;
    }
    this.snake.step();
    head = this.snake.head();
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
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
      this.food = this.randomEmptyCell();
    }
  };

  global.GameModel = GameModel;
}(typeof window !== "undefined" ? window : this));
