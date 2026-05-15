(function (global) {
  "use strict";

  /**
   * Facade over Model + View + Controller: DOM wiring, ads bridge, welcome flow.
   * @param {Object} options
   * @param {number} [options.cell]
   * @param {number} [options.cols]
   * @param {number} [options.rows]
   * @param {number} [options.stepMs]
   * @param {string} [options.canvasId]
   * @param {string} [options.scoreId]
   * @param {string} [options.startButtonId]
   * @param {string} [options.welcomeId]
   * @param {string} [options.preGameId]
   * @param {string} [options.gameRootId]
   */
  function Game(options) {
    options = options || {};
    this.cell = options.cell != null ? options.cell : 20;
    this.cols = options.cols != null ? options.cols : 20;
    this.rows = options.rows != null ? options.rows : 20;
    this.stepMs = options.stepMs != null ? options.stepMs : 120;
    this.canvasId = options.canvasId || "board";
    this.scoreId = options.scoreId || "score";
    this.startButtonId = options.startButtonId || "btn-start-game";
    this.welcomeId = options.welcomeId || "welcome-screen";
    this.preGameId = options.preGameId || "pre-game";
    this.gameRootId = options.gameRootId || "game-root";
    this.model = null;
    this.view = null;
    this.controller = null;
    this._playStarted = false;
  }

  Game.prototype._setDisplay = function (elementId, value) {
    var el = document.getElementById(elementId);
    if (el) {
      el.style.display = value;
    }
  };

  Game.prototype.onReturnToWelcome = function () {
    if (typeof global.snakeResetAdsFlow === "function") {
      global.snakeResetAdsFlow();
    }
    this._setDisplay(this.welcomeId, "block");
    this._setDisplay(this.preGameId, "none");
    this._setDisplay(this.gameRootId, "none");
    this._playStarted = false;
  };

  Game.prototype.startFromAds = function () {
    if (this._playStarted) {
      return;
    }
    this._playStarted = true;
    this.controller.start();
  };

  Game.prototype.bindStartButton = function () {
    var btn = document.getElementById(this.startButtonId);
    if (!btn) {
      return;
    }
    var self = this;
    btn.onclick = function () {
      self._setDisplay(self.welcomeId, "none");
      self._setDisplay(self.preGameId, "block");
      if (typeof global.snakeRunAdsThenStartGame === "function") {
        global.snakeRunAdsThenStartGame();
      }
    };
  };

  Game.prototype.bindCancelButton = function () {
    var cancelBtn = document.getElementById("btn-cancel-game");
    if (!cancelBtn) {
      return;
    }
    cancelBtn.onclick = function () {
      // Just close the page or hide welcome
      document.getElementById("welcome-screen").style.display = "none";
    };
  };

  Game.prototype.init = function () {
    var self = this;
    this.model = new GameModel(this.cols, this.rows);
    this.view = new GameView(
      document.getElementById(this.canvasId),
      document.getElementById(this.scoreId),
      this.cell,
      this.cols,
      this.rows
    );
    this.controller = new GameController(this.model, this.view, this.stepMs);
    this.controller.onReturnToWelcome = function () {
      self.onReturnToWelcome();
    };
    global.snakeStartGame = function () {
      self.startFromAds();
    };
    this.bindStartButton();
    this.bindCancelButton();
  };

  global.Game = Game;
}(typeof window !== "undefined" ? window : this));
