"use strict";

import { GameModel } from './model.js';
import { GameView } from './view.js';
import { GameController } from './controller.js';

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
 * @param {string} [options.uiRootId]
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
  this.uiRootId = options.uiRootId || "ui-root";
  this.model = null;
  this.view = null;
  this.controller = null;
  this._playStarted = false;
  this._currentUIClone = null;
}

Game.prototype._clearUIRoot = function () {
  var uiRoot = document.getElementById(this.uiRootId);
  if (uiRoot) {
    uiRoot.innerHTML = "";
  }
  this._currentUIClone = null;
};

Game.prototype._showTemplate = function (templateId) {
  this._clearUIRoot();
  var template = document.getElementById(templateId);
  var uiRoot = document.getElementById(this.uiRootId);
  if (!template || !uiRoot) {
    return null;
  }
  var clone = template.content.cloneNode(true);
  uiRoot.appendChild(clone);
  this._currentUIClone = uiRoot.firstElementChild;
  return this._currentUIClone;
};

Game.prototype._setDisplay = function (elementId, value) {
  var el = document.getElementById(elementId);
  if (el) {
    el.style.display = value;
  }
};

Game.prototype.onReturnToWelcome = function () {
  if (typeof window.snakeResetAdsFlow === "function") {
    window.snakeResetAdsFlow();
  }
  this._showTemplate(this.welcomeId);
  this.bindStartButton();
  this.bindCancelButton();
  this.bindHelpButton();
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
    self._showTemplate(self.preGameId);
    self._setDisplay(self.gameRootId, "none");
    if (typeof window.snakeRunAdsThenStartGame === "function") {
      window.snakeRunAdsThenStartGame();
    }
  };
};

Game.prototype.bindCancelButton = function () {
  var cancelBtn = document.getElementById("btn-cancel-game");
  if (!cancelBtn) {
    return;
  }
  var self = this;
  cancelBtn.onclick = function () {
    self._clearUIRoot();
  };
};

Game.prototype.bindHelpButton = function () {
  var helpBtn = document.getElementById("btn-help-game");
  if (!helpBtn) {
    return;
  }
  var self = this;
  helpBtn.onclick = function () {
    self._showTemplate("help-game");
    self.bindBackFromHelpButton();
  };
};

Game.prototype.bindBackFromHelpButton = function () {
  var helpContainer = document.querySelector(".help-prompt");
  if (!helpContainer) {
    return;
  }
  var self = this;
  var backBtn = document.getElementById("btn-back-from-help");
  if (!backBtn) {
    return;
  }
  backBtn.onclick = function () {
    self.onReturnToWelcome();
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
  window.snakeStartGame = function () {
    self.startFromAds();
  };
  // Show welcome screen on init
  this._showTemplate(this.welcomeId);
  this.bindStartButton();
  this.bindCancelButton();
  this.bindHelpButton();
  this._setDisplay(this.gameRootId, "none");
};

export { Game };
