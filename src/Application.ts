import { AdsManager } from './ads/AdsManager';
import { DOM_IDS, GAME_CONFIG } from './config';
import { UIController } from './doomUI';
import { Game } from './game';

/**
 * Game-specific configuration options
 */
export interface GameOptions {
  /** Cell size in pixels */
  cell: number;
  /** Number of columns in the grid */
  cols: number;
  /** Number of rows in the grid */
  rows: number;
  /** Game speed - milliseconds per step */
  stepMs: number;
  /** Initial snake length */
  initialSnakeLength: number;
}

/**
 * UI-specific configuration options
 */
export interface DoomUIOptions {
  /** Canvas element ID */
  canvasId: string;
  /** Game root container ID */
  gameRootId: string;
  /** UI root container ID */
  uiRootId: string;
}

/**
 * Application initialization options
 * 
 * @example
 * ```typescript
 * // Full configuration
 * const app = new Application({
 *   game: {
 *     cell: 20,
 *     cols: 20,
 *     rows: 20,
 *     stepMs: 600
 *   },
 *   ui: {
 *     canvasId: 'board',
 *     gameRootId: 'game-root',
 *     uiRootId: 'ui-root'
 *   }
 * });
 * 
 * // Using defaults
 * const app = new Application();
 * 
 * // Partial configuration
 * const app = new Application({
 *   game: { stepMs: 400 } // Faster game speed, other values use defaults
 * });
 * ```
 */
export interface ApplicationOptions {
  /** Game configuration */
  game?: GameOptions;
  /** UI configuration */
  ui?: DoomUIOptions;
}

/**
 * Facade over Model + View + Controller: DOM wiring, ads bridge, welcome flow.
 */
export class Application {
  protected gameOpts: GameOptions;
  protected uiOpts: DoomUIOptions;

  private game: Game | null;
  uiController: UIController | null;
  protected adsManager: AdsManager | null;
  private _playStarted: boolean;

  constructor(options: ApplicationOptions = {}) {
    // Game options
    this.gameOpts = {
        cell: GAME_CONFIG.CELL_SIZE,
        cols: GAME_CONFIG.GRID_COLS,
        rows: GAME_CONFIG.GRID_ROWS,
        stepMs: GAME_CONFIG.STEP_MS,
        initialSnakeLength: GAME_CONFIG.INITIAL_SNAKE_LENGTH,
      ...options.game
    };
    
    // UI options
    this.uiOpts = {
      canvasId: DOM_IDS.CANVAS,
      gameRootId: DOM_IDS.GAME_ROOT,
      uiRootId: DOM_IDS.UI_ROOT,
      ...options.ui,
    }

    this.game = null;
    this.uiController = null;
    this.adsManager = null;
    this._playStarted = false;
  }

  startFromAds(): void {
    if (this._playStarted) {
      return;
    }
    this._playStarted = true;
    this.uiController?.showGame();
    this.game?.start();
  }

  init(): void {
    try {
      // Initialize UIController with callbacks
      this.uiController = new UIController(
        this.uiOpts.uiRootId,
        this.uiOpts.gameRootId,
        {
          onStartGame: this.onStartGame.bind(this),
          onCancelGame: this.onCancelGame.bind(this),
          onShowHelp: this.onShowHelp.bind(this),
          onBackFromHelp: this.onBackFromHelp.bind(this),
        }
      );

      this.adsManager = new AdsManager();

      // Get canvas and score elements from UI controller
      const { canvas, scoreElement } = this.uiController.getGameElements(
        this.uiOpts.canvasId
      );

      // Initialize game with all required options
      const gameOptions: Required<GameOptions> = {
        cell: this.gameOpts.cell,
        cols: this.gameOpts.cols,
        rows: this.gameOpts.rows,
        stepMs: this.gameOpts.stepMs,
        initialSnakeLength: this.gameOpts.initialSnakeLength,
      };

      this.game = new Game(
        canvas, scoreElement, gameOptions,
        {
          onReturnToWelcome: this.onReturnToWelcome.bind(this)
        }
      );

      // Show welcome screen on init
      this.uiController.showWelcomeScreen();
    } catch (error) {
      console.error('Failed to initialize Application:', error);
      throw error; // Re-throw to be caught by main.ts
    }
  }

  onStartGame(): void {
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
  };

  onCancelGame(): void {
    this.uiController?.clear();
  };

  onShowHelp(): void {
    this.uiController?.showHelpScreen();
  };

  onBackFromHelp(): void {
    this.onReturnToWelcome();
  }

  onReturnToWelcome(): void {
    this.adsManager?.resetAdsFlow();
    this.uiController?.showWelcomeScreen();
    this._playStarted = false;
  }

  /**
   * Clean up resources and prevent memory leaks
   */
  destroy(): void {
    this.game?.destroy();
    this.adsManager?.resetAdsFlow();
    this.uiController?.clear();
  }
}
