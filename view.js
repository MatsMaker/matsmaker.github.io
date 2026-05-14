(function (global) {
  "use strict";

  function GameView(canvas, scoreEl, cell, cols, rows) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scoreEl = scoreEl;
    this.cell = cell;
    this.cols = cols;
    this.rows = rows;
  }

  GameView.prototype.render = function (model) {
    var ctx = this.ctx;
    var s;
    var i;
    var seg;
    var f;
    if (!model || !model.snake || !model.food) {
      return;
    }
    if (this.scoreEl) {
      this.scoreEl.textContent = "Score: " + model.score;
    }
    s = model.snake.segments;
    f = model.food;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    for (i = 0; i <= this.cols; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * this.cell + 0.5, 0);
      ctx.lineTo(i * this.cell + 0.5, this.rows * this.cell);
      ctx.stroke();
    }
    for (i = 0; i <= this.rows; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.cell + 0.5);
      ctx.lineTo(this.cols * this.cell, i * this.cell + 0.5);
      ctx.stroke();
    }
    ctx.fillStyle = "#c94c4c";
    ctx.fillRect(f.x * this.cell + 1, f.y * this.cell + 1, this.cell - 2, this.cell - 2);
    for (i = 0; i < s.length; i += 1) {
      seg = s[i];
      ctx.fillStyle = i === 0 ? "#6ecf6e" : "#4a9f4a";
      ctx.fillRect(seg.x * this.cell + 1, seg.y * this.cell + 1, this.cell - 2, this.cell - 2);
    }
    if (!model.running) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "Game over — press Backspace for start screen",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
  };

  global.GameView = GameView;
}(typeof window !== "undefined" ? window : this));
