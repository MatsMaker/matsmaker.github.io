import { GameModel } from './GameModel/GameModel';
import { GameView } from './GameView';

export default class GameController {
  model: GameModel;
  view: GameView;
  stepMs: number;
  lastTick: number;
  accum: number;
  boundLoop: (now: number) => void;
  boundKeydown: (e: KeyboardEvent) => void;
  inputAttached: boolean;
  loopActive: boolean;
  onReturnToWelcome: (() => void) | null;

  constructor(model: GameModel, view: GameView, stepMs: number = 120) {
    this.model = model;
    this.view = view;
    this.stepMs = stepMs;
    this.lastTick = 0;
    this.accum = 0;
    this.boundLoop = this.loop.bind(this);
    this.boundKeydown = this.onKeydown.bind(this);
    this.inputAttached = false;
    this.loopActive = false;
    this.onReturnToWelcome = null;
  }

  onKeydown(e: KeyboardEvent): void {
    const key = e.keyCode;
    // Back button: Backspace (8), TV Back (461, 10009)
    if (key === 8 || key === 461 || key === 10009) {
      e.preventDefault();
      if (!this.model.running && this.model.snake) {
        this.pauseForMenu();
        this.model.clear();
        if (typeof this.onReturnToWelcome === 'function') {
          this.onReturnToWelcome();
        }
      }
      return;
    }
    if (!this.model.running) {
      return;
    }
    // Left: Arrow Left (37), TV Left (37, 21)
    if (key === 37 || key === 21) {
      e.preventDefault();
      this.model.queueDirection(-1, 0);
    // Up: Arrow Up (38), TV Up (38, 19)
    } else if (key === 38 || key === 19) {
      e.preventDefault();
      this.model.queueDirection(0, -1);
    // Right: Arrow Right (39), TV Right (39, 22)
    } else if (key === 39 || key === 22) {
      e.preventDefault();
      this.model.queueDirection(1, 0);
    // Down: Arrow Down (40), TV Down (40, 20)
    } else if (key === 40 || key === 20) {
      e.preventDefault();
      this.model.queueDirection(0, 1);
    // TV Color buttons for quick direction change
    // Red (403) - Left, Green (404) - Up, Yellow (405) - Right, Blue (406) - Down
    } else if (key === 403) {
      e.preventDefault();
      this.model.queueDirection(-1, 0);
    } else if (key === 404) {
      e.preventDefault();
      this.model.queueDirection(0, -1);
    } else if (key === 405) {
      e.preventDefault();
      this.model.queueDirection(1, 0);
    } else if (key === 406) {
      e.preventDefault();
      this.model.queueDirection(0, 1);
    }
  }

  loop(now: number): void {
    if (!this.loopActive) {
      return;
    }
    if (this.lastTick === 0) {
      this.lastTick = now;
    }
    this.accum += now - this.lastTick;
    this.lastTick = now;
    while (this.accum >= this.stepMs && this.model.running) {
      this.model.step();
      this.accum -= this.stepMs;
    }
    this.view.render(this.model);
    window.requestAnimationFrame(this.boundLoop);
  }

  pauseForMenu(): void {
    this.loopActive = false;
  }

  start(): void {
    this.loopActive = true;
    this.model.reset();
    this.lastTick = 0;
    this.accum = 0;
    if (!this.inputAttached) {
      this.inputAttached = true;
      window.addEventListener('keydown', this.boundKeydown, false);
    }
    window.requestAnimationFrame(this.boundLoop);
  }
}
