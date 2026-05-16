import { GameModel } from './GameModel/GameModel';
import { GameView } from './GameView';
import { GameController } from './GameController';
import { UIController } from './UIController';

interface ApplicationOptions {
  cell?: number;
  cols?: number;
  rows?: number;
  stepMs?: number;
  canvasId?: string;
  scoreId?: string;
  startButtonId?: string;
  gameRootId?: string;
  uiRootId?: string;
}

/**
 * Facade over Model + View + Controller: DOM wiring, ads bridge, welcome flow.
 */
export class Application {
  cell: number;
  cols: number;
  rows: number;
  stepMs: number;
  canvasId: string;
  scoreId: string;
  startButtonId: string;
  gameRootId: string;
  uiRootId: string;
  model: GameModel | null;
  view: GameView | null;
  controller: GameController | null;
  uiController: UIController | null;
  private _playStarted: boolean;

  constructor(options: ApplicationOptions = {}) {
    this.cell = options.cell ?? 20;
    this.cols = options.cols ?? 20;
    this.rows = options.rows ?? 20;
    this.stepMs = options.stepMs ?? 120;
    this.canvasId = options.canvasId || 'board';
    this.gameRootId = options.gameRootId || 'game-root';
    this.uiRootId = options.uiRootId || 'ui-root';

    this.scoreId = options.scoreId || 'score';
    this.startButtonId = options.startButtonId || 'btn-start-game';

    this.model = null;
    this.view = null;
    this.controller = null;
    this.uiController = null;
    this._playStarted = false;
  }

  onReturnToWelcome(): void {
    if (typeof window.snakeResetAdsFlow === 'function') {
      window.snakeResetAdsFlow();
    }
    this.uiController?.showWelcomeScreen();
    this._playStarted = false;
  }

  startFromAds(): void {
    if (this._playStarted) {
      return;
    }
    this._playStarted = true;
    this.uiController?.showGame();
    this.controller?.start();
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

    // Initialize UIController with callbacks
    this.uiController = new UIController(
      this.uiRootId,
      this.gameRootId,
      {
        onStartGame: () => {
          this.uiController?.showPreGameScreen();
          if (typeof window.snakeRunAdsThenStartGame === 'function') {
            window.snakeRunAdsThenStartGame();
          }
        },
        onCancelGame: () => {
          this.uiController?.clear();
        },
        onShowHelp: () => {
          this.uiController?.showHelpScreen();
        },
        onBackFromHelp: () => {
          this.onReturnToWelcome();
        }
      }
    );

    window.snakeStartGame = () => {
      this.startFromAds();
    };

    // Show welcome screen on init
    this.uiController.showWelcomeScreen();
  }
}
