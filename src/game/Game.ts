import { GameModel } from './GameModel';
import { GameRender } from './GameRender';
import { GameController } from './GameController';
import type { GameOptions } from '../Application';

/**
 * Game initialization and lifecycle management
 * Encapsulates Model, View, and Controller setup
 */
export class Game {
  private model: GameModel;
  private view: GameRender;
  private controller: GameController;

  constructor(
    canvas: HTMLCanvasElement,
    scoreElement: HTMLElement | null,
    options: Required<GameOptions>,
    callbacks: { onReturnToWelcome: () => void }
  ) {
    // Initialize Model
    this.model = new GameModel(
      options.cols,
      options.rows,
      options.initialSnakeLength
    );

    // Initialize View
    this.view = new GameRender(
      canvas,
      scoreElement,
      options.cell,
      options.cols,
      options.rows
    );

    // Initialize Controller
    this.controller = new GameController(
      this.model,
      this.view,
      options.stepMs
    );

    // Set up return to welcome callback
    this.controller.onReturnToWelcome = callbacks.onReturnToWelcome;
  }

  /**
   * Start the game
   */
  start(): void {
    this.controller.start();
  }

  /**
   * Clean up game resources
   */
  destroy(): void {
    this.controller.destroy();
    this.model.clear();
  }

}
