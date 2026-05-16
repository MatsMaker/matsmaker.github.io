import { GameModel } from './GameModel/GameModel';
import { GameView } from './GameView';
import GameController from './GameController';

interface GameOptions {
  cell?: number;
  cols?: number;
  rows?: number;
  stepMs?: number;
  canvasId?: string;
  scoreId?: string;
  startButtonId?: string;
  welcomeId?: string;
  preGameId?: string;
  gameRootId?: string;
  uiRootId?: string;
}

/**
 * Facade over Model + View + Controller: DOM wiring, ads bridge, welcome flow.
 */
class Game {
  cell: number;
  cols: number;
  rows: number;
  stepMs: number;
  canvasId: string;
  scoreId: string;
  startButtonId: string;
  welcomeId: string;
  preGameId: string;
  gameRootId: string;
  uiRootId: string;
  model: GameModel | null;
  view: GameView | null;
  controller: GameController | null;
  private _playStarted: boolean;
  private _currentUIClone: Element | null;

  constructor(options: GameOptions = {}) {
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

  private _clearUIRoot(): void {
    const uiRoot = document.getElementById(this.uiRootId);
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
    this._currentUIClone = null;
  }

  private _showTemplate(templateId: string): Element | null {
    this._clearUIRoot();
    const template = document.getElementById(templateId) as HTMLTemplateElement | null;
    const uiRoot = document.getElementById(this.uiRootId);
    if (!template || !uiRoot) {
      return null;
    }
    const clone = template.content.cloneNode(true);
    uiRoot.appendChild(clone);
    this._currentUIClone = uiRoot.firstElementChild;
    return this._currentUIClone;
  }

  private _setDisplay(elementId: string, value: string): void {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = value;
    }
  }

  onReturnToWelcome(): void {
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

  startFromAds(): void {
    if (this._playStarted) {
      return;
    }
    this._playStarted = true;
    this.controller?.start();
  }

  bindStartButton(): void {
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

  bindCancelButton(): void {
    const cancelBtn = document.getElementById('btn-cancel-game');
    if (!cancelBtn) {
      return;
    }
    cancelBtn.onclick = () => {
      this._clearUIRoot();
    };
  }

  bindHelpButton(): void {
    const helpBtn = document.getElementById('btn-help-game');
    if (!helpBtn) {
      return;
    }
    helpBtn.onclick = () => {
      this._showTemplate('help-game');
      this.bindBackFromHelpButton();
    };
  }

  bindBackFromHelpButton(): void {
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

  init(): void {
    this.model = new GameModel(this.cols, this.rows);
    
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement | null;
    const scoreEl = document.getElementById(this.scoreId);
    
    if (!canvas) {
      throw new Error(`Canvas element with id "${this.canvasId}" not found`);
    }
    
    this.view = new GameView(
      canvas,
      scoreEl,
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
