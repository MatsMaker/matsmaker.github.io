import { GameModel } from './GameModel';
import { GameRender } from './GameRender';
import { TV_KEY_MAPPINGS, LG_WEBOS_REGISTER_KEYS } from '../config';

export class GameController {
  model: GameModel;
  view: GameRender;
  stepMs: number;
  lastTick: number;
  accum: number;
  boundLoop: (now: number) => void;
  boundKeydown: (e: KeyboardEvent) => void;
  boundMouseDown: (e: MouseEvent) => void;
  inputAttached: boolean;
  loopActive: boolean;
  onReturnToWelcome: (() => void) | null;

  constructor(model: GameModel, view: GameRender, stepMs: number = 120) {
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
    const { MOUSE_BUTTONS } = TV_KEY_MAPPINGS;
    switch(e.button) {
      case MOUSE_BUTTONS.UP: this.model.queueDirection(0, -1); break;
      case MOUSE_BUTTONS.DOWN: this.model.queueDirection(0, 1); break;
      case MOUSE_BUTTONS.LEFT: this.model.queueDirection(-1, 0); break;
      case MOUSE_BUTTONS.RIGHT: this.model.queueDirection(1, 0); break;
    }
  }

  onKeydown(e: KeyboardEvent): void {
    const key = e.key;
    const keyCode = e.keyCode;
    
    // Prevent browser navigation
    e.preventDefault();
    
    // Back button: Backspace, TV Back buttons
    const { BACK_KEYS, LG_KEY_CODES } = TV_KEY_MAPPINGS;
    const isBackKey = (BACK_KEYS as readonly string[]).includes(key) || 
                      LG_KEY_CODES.BACK.includes(keyCode);
    
    if (isBackKey) {
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
    
    // Direction keys with TV platform support
    if (this.isLeftKey(key, keyCode)) {
      this.model.queueDirection(-1, 0);
    } else if (this.isUpKey(key, keyCode)) {
      this.model.queueDirection(0, -1);
    } else if (this.isRightKey(key, keyCode)) {
      this.model.queueDirection(1, 0);
    } else if (this.isDownKey(key, keyCode)) {
      this.model.queueDirection(0, 1);
    }
  }

  private isLeftKey(key: string, keyCode: number): boolean {
    const { LG_KEY_CODES } = TV_KEY_MAPPINGS;
    return key === 'ArrowLeft' || key === 'Left' || key === 'MediaRewind' || 
           key === 'ColorF0Red' || LG_KEY_CODES.LEFT.includes(keyCode);
  }

  private isUpKey(key: string, keyCode: number): boolean {
    const { LG_KEY_CODES } = TV_KEY_MAPPINGS;
    return key === 'ArrowUp' || key === 'Up' || 
           key === 'ColorF1Green' || LG_KEY_CODES.UP.includes(keyCode);
  }

  private isRightKey(key: string, keyCode: number): boolean {
    const { LG_KEY_CODES } = TV_KEY_MAPPINGS;
    return key === 'ArrowRight' || key === 'Right' || key === 'MediaFastForward' || 
           key === 'ColorF2Yellow' || LG_KEY_CODES.RIGHT.includes(keyCode);
  }

  private isDownKey(key: string, keyCode: number): boolean {
    const { LG_KEY_CODES } = TV_KEY_MAPPINGS;
    return key === 'ArrowDown' || key === 'Down' || 
           key === 'ColorF3Blue' || LG_KEY_CODES.DOWN.includes(keyCode);
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
    if (w.webOSDev?.keyboardHook) {
      try {
        LG_WEBOS_REGISTER_KEYS.forEach((key) => {
          try { 
            w.webOSDev.keyboardHook.registerKey(key); 
          } catch { 
            // Ignore individual key registration failures
          }
        });
      } catch { 
        // Ignore if keyboard hook is not available
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

  /**
   * Clean up event listeners and stop the game loop
   * CRITICAL: Call this before destroying the controller to prevent memory leaks
   */
  destroy(): void {
    this.pauseForMenu();
    
    if (this.inputAttached) {
      const options = { capture: true };
      
      // Remove keyboard event listeners
      window.removeEventListener('keydown', this.boundKeydown, options);
      document.removeEventListener('keydown', this.boundKeydown, options);
      
      // Remove mouse event listeners
      window.removeEventListener('mousedown', this.boundMouseDown, options);
      document.removeEventListener('mousedown', this.boundMouseDown, options);
      
      this.inputAttached = false;
    }
  }
}
