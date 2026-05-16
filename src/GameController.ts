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
  boundMouseDown: (e: MouseEvent) => void;
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
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.inputAttached = false;
    this.loopActive = false;
    this.onReturnToWelcome = null;
  }

  onMouseDown(e: MouseEvent): void {
    // TV remotes that send mouse events instead of keyboard events
    e.preventDefault();
    
    if (!this.model.running) {
      return;
    }
    
    // Map mouse button to direction (TV remote arrows)
    switch(e.button) {
      case 1: this.model.queueDirection(0, -1); break; // Up
      case 2: this.model.queueDirection(0, 1); break;  // Down
      case 3: this.model.queueDirection(-1, 0); break; // Left
      case 4: this.model.queueDirection(1, 0); break;  // Right
    }
  }

  onKeydown(e: KeyboardEvent): void {
    const key = e.key;
    const keyCode = e.keyCode;
    
    // Prevent browser navigation
    e.preventDefault();
    
    // Back button: Backspace, TV Back buttons (including LG 461, 10009, 27 for ESC)
    if (key === 'Backspace' || key === 'Back' || key === 'XF86Back' || keyCode === 8 || keyCode === 461 || keyCode === 10009 || keyCode === 27) {
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
    
    // Left: Arrow keys, TV remote, and LG webOS
    if (key === 'ArrowLeft' || key === 'Left' || key === 'MediaRewind' || keyCode === 37 || keyCode === 21 || keyCode === 4 || key === 'ColorF0Red' || keyCode === 403) {
      this.model.queueDirection(-1, 0);
    // Up: Arrow keys, TV remote, and LG webOS
    } else if (key === 'ArrowUp' || key === 'Up' || keyCode === 38 || keyCode === 19 || keyCode === 0 || key === 'ColorF1Green' || keyCode === 404) {
      this.model.queueDirection(0, -1);
    // Right: Arrow keys, TV remote, and LG webOS
    } else if (key === 'ArrowRight' || key === 'Right' || key === 'MediaFastForward' || keyCode === 39 || keyCode === 22 || keyCode === 5 || key === 'ColorF2Yellow' || keyCode === 405) {
      this.model.queueDirection(1, 0);
    // Down: Arrow keys, TV remote, and LG webOS
    } else if (key === 'ArrowDown' || key === 'Down' || keyCode === 40 || keyCode === 20 || keyCode === 1 || key === 'ColorF3Blue' || keyCode === 406) {
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
      
      // Register LG webOS keys (backup - HTML should have done this)
      this.registerLGKeys();
      
      // Attach event listeners with capture phase
      const options = { capture: true, passive: false };
      
      // Keyboard events
      window.addEventListener('keydown', this.boundKeydown, options);
      document.addEventListener('keydown', this.boundKeydown, options);
      
      // Mouse events for TV remotes
      window.addEventListener('mousedown', this.boundMouseDown, options);
      document.addEventListener('mousedown', this.boundMouseDown, options);
      
      // Ensure body can receive focus
      if (document.body) {
        document.body.setAttribute('tabindex', '0');
        document.body.focus();
      }
    }
    window.requestAnimationFrame(this.boundLoop);
  }

  registerLGKeys(): void {
    // Backup LG webOS key registration (HTML should have done this already)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    
    // webOS 3.0+
    if (w.webOSDev && w.webOSDev.keyboardHook) {
      try {
        const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down', 'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue', 'Back', 'Enter'];
        keys.forEach((key) => {
          try { 
            w.webOSDev.keyboardHook.registerKey(key); 
          } catch { 
            // Ignore 
          }
        });
      } catch { 
        // Ignore
      }
    }
    
    // Legacy webOS
    if (w.PalmSystem) {
      try { 
        w.PalmSystem.keyMask = 0xFFFFFFFF; 
      } catch { 
        // Ignore
      }
    }
    
    // Very old NetCast
    if (w.NetCastSetKeys) {
      try { 
        w.NetCastSetKeys(0xFFFFFFFF); 
      } catch { 
        // Ignore
      }
    }
  }
}
