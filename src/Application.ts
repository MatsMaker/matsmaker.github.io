import { GameModel } from './game/GameModel';
import { GameView } from './game/GameView';
import { GameController } from './game/GameController';
import { AdsManager } from './AdsManager';
import { GAME_CONFIG } from './config';
import { UIController } from './ui/UIController';

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
  protected adsManager: AdsManager | null;
  private _playStarted: boolean;

  constructor(options: ApplicationOptions = {}) {
    this.cell = options.cell ?? GAME_CONFIG.CELL_SIZE;
    this.cols = options.cols ?? GAME_CONFIG.GRID_COLS;
    this.rows = options.rows ?? GAME_CONFIG.GRID_ROWS;
    this.stepMs = options.stepMs ?? GAME_CONFIG.STEP_MS;
    this.canvasId = options.canvasId || 'board';
    this.gameRootId = options.gameRootId || 'game-root';
    this.uiRootId = options.uiRootId || 'ui-root';

    this.scoreId = options.scoreId || 'score';
    this.startButtonId = options.startButtonId || 'btn-start-game';

    this.model = null;
    this.view = null;
    this.controller = null;
    this.uiController = null;
    this.adsManager = null;
    this._playStarted = false;
  }

  onReturnToWelcome(): void {
    this.adsManager?.resetAdsFlow();
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
    try {
      this.adsManager = new AdsManager();
      this.model = new GameModel(this.cols, this.rows);
      
      const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement | null;
      const scoreEl = document.getElementById(this.scoreId);
      
      if (!canvas) {
        throw new Error(`Canvas element with id "${this.canvasId}" not found`);
      }
      
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`Element with id "${this.canvasId}" is not a canvas element`);
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
            this.adsManager?.runAdsThenStartGame()
              .then(() => {
                this.startFromAds();
              })
              .catch((error) => {
                console.error('Ad flow failed:', error);
                // Start game anyway if ads fail
                this.startFromAds();
              });
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

      // Show welcome screen on init
      this.uiController.showWelcomeScreen();
    } catch (error) {
      console.error('Failed to initialize Application:', error);
      throw error; // Re-throw to be caught by main.ts
    }
  }

  /**
   * Clean up resources and prevent memory leaks
   */
  destroy(): void {
    this.controller?.destroy();
    this.adsManager?.resetAdsFlow();
    this.model?.clear();
    this.uiController?.clear();
  }
}
