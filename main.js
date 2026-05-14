(function () {
  "use strict";

  var CELL = 20;
  var COLS = 20;
  var ROWS = 20;
  var STEP_MS = 120;

  var model = new GameModel(COLS, ROWS);
  var canvas = document.getElementById("board");
  var scoreEl = document.getElementById("score");
  var view = new GameView(canvas, scoreEl, CELL, COLS, ROWS);
  var controller = new GameController(model, view, STEP_MS);

  var started = false;

  window.wormStartGame = function () {
    if (started) {
      return;
    }
    started = true;
    controller.start();
  };

  (function wireStartPrompt() {
    var btn = document.getElementById("btn-start-game");
    var welcome = document.getElementById("welcome-screen");
    var pre = document.getElementById("pre-game");
    if (!btn) {
      return;
    }
    btn.onclick = function () {
      if (welcome) {
        welcome.style.display = "none";
      }
      if (pre) {
        pre.style.display = "block";
      }
      if (typeof window.wormRunAdsThenStartGame === "function") {
        window.wormRunAdsThenStartGame();
      }
    };
  }());
}());
