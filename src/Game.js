import GameModel from './GameModel/GameModel.js';
import GameView from './GameView.js';
import GameController from './GameController.js';

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
class Game {
  constructor(options = {}) {
    this.cell = options.cell ?? 20;
    this.cols = options.cols ?? 20;
    this.rows = options.rows ?? 20;
    this.stepMs = options.stepMs ?? 120;
    this.canvasId = options.canvasId || 'board';
    this.scoreId = options.scoreId || 'score';
    this.startButtonId = options.startButtonId || 'btn-start-game';
    this.welcomeId = options.welcomeId || 'welcome-screen';
    this.preGameId = options.preGameId || 'pre-game';
    this.gameRootId = options.gameRootId || 'game-root';
    this.uiRootId = options.uiRootId || 'ui-root';
    this.model = null;
    this.view = null;
    this.controller = null;
    this._playStarted = false;
    this._currentUIClone = null;
  }

  _clearUIRoot() {
    const uiRoot = document.getElementById(this.uiRootId);
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
    this._currentUIClone = null;
  }

  _showTemplate(templateId) {
    this._clearUIRoot();
    const template = document.getElementById(templateId);
    const uiRoot = document.getElementById(this.uiRootId);
    if (!template || !uiRoot) {
      return null;
    }
    const clone = template.content.cloneNode(true);
    uiRoot.appendChild(clone);
    this._currentUIClone = uiRoot.firstElementChild;
    return this._currentUIClone;
  }

  _setDisplay(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = value;
    }
  }

  onReturnToWelcome() {
    if (typeof window.snakeResetAdsFlow === 'function') {
      window.snakeResetAdsFlow();
    }
    this._showTemplate(this.welcomeId);
    this.bindStartButton();
    this.bindCancelButton();
    this.bindHelpButton();
    this._setDisplay(this.gameRootId, 'none');
    this._playStarted = false;
  }

  startFromAds() {
    if (this._playStarted) {
      return;
    }
    this._playStarted = true;
    this.controller.start();
  }

  bindStartButton() {
    const btn = document.getElementById(this.startButtonId);
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      this._showTemplate(this.preGameId);
      this._setDisplay(this.gameRootId, 'none');
      if (typeof window.snakeRunAdsThenStartGame === 'function') {
        window.snakeRunAdsThenStartGame();
      }
    };
  }

  bindCancelButton() {
    const cancelBtn = document.getElementById('btn-cancel-game');
    if (!cancelBtn) {
      return;
    }
    cancelBtn.onclick = () => {
      this._clearUIRoot();
    };
  }

  bindHelpButton() {
    const helpBtn = document.getElementById('btn-help-game');
    if (!helpBtn) {
      return;
    }
    helpBtn.onclick = () => {
      this._showTemplate('help-game');
      this.bindBackFromHelpButton();
    };
  }

  bindBackFromHelpButton() {
    const helpContainer = document.querySelector('.help-prompt');
    if (!helpContainer) {
      return;
    }
    const backBtn = document.getElementById('btn-back-from-help');
    if (!backBtn) {
      return;
    }
    backBtn.onclick = () => {
      this.onReturnToWelcome();
    };
  }

  init() {
    this.model = new GameModel(this.cols, this.rows);
    this.view = new GameView(
      document.getElementById(this.canvasId),
      document.getElementById(this.scoreId),
      this.cell,
      this.cols,
      this.rows
    );
    this.controller = new GameController(this.model, this.view, this.stepMs);
    this.controller.onReturnToWelcome = () => {
      this.onReturnToWelcome();
    };
    window.snakeStartGame = () => {
      this.startFromAds();
    };
    // Show welcome screen on init
    this._showTemplate(this.welcomeId);
    this.bindStartButton();
    this.bindCancelButton();
    this.bindHelpButton();
    this._setDisplay(this.gameRootId, 'none');
  }
}

export default Game;
