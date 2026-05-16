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
    const key = e.key;
    const keyCode = e.keyCode;
    
    // Debug: Log all key presses to help diagnose TV remote issues
    alert(`Key pressed: key="${key}", keyCode=${keyCode}, code="${e.code}"`);
    
    // Back button: Backspace, TV Back buttons
    if (key === 'Backspace' || key === 'Back' || keyCode === 8 || keyCode === 461 || keyCode === 10009) {
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
    
    // Left: Arrow keys and TV remote
    if (key === 'ArrowLeft' || key === 'Left' || keyCode === 37 || keyCode === 21 || key === 'ColorF0Red' || keyCode === 403) {
      e.preventDefault();
      this.model.queueDirection(-1, 0);
    // Up: Arrow keys and TV remote
    } else if (key === 'ArrowUp' || key === 'Up' || keyCode === 38 || keyCode === 19 || key === 'ColorF1Green' || keyCode === 404) {
      e.preventDefault();
      this.model.queueDirection(0, -1);
    // Right: Arrow keys and TV remote
    } else if (key === 'ArrowRight' || key === 'Right' || keyCode === 39 || keyCode === 22 || key === 'ColorF2Yellow' || keyCode === 405) {
      e.preventDefault();
      this.model.queueDirection(1, 0);
    // Down: Arrow keys and TV remote
    } else if (key === 'ArrowDown' || key === 'Down' || keyCode === 40 || keyCode === 20 || key === 'ColorF3Blue' || keyCode === 406) {
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
      alert('Use arrow keys or TV remote to control the snake. Press Backspace or Back button to return to the menu.');
      window.addEventListener('keydown', this.boundKeydown, false);
    }
    window.requestAnimationFrame(this.boundLoop);
  }
}
