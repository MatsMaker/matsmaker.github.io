import { UIView } from './UIView';

interface UIControllerCallbacks {
  onStartGame: () => void;
  onCancelGame: () => void;
  onShowHelp: () => void;
  onBackFromHelp: () => void;
}

/**
 * UIController - Manages all UI rendering and event binding
 * Separates UI concerns from game logic
 */
export class UIController {
  private uiRootId: string;
  private gameRootId: string;
  private callbacks: UIControllerCallbacks;
  private currentUIElement: Element | null;

  constructor(
    uiRootId: string,
    gameRootId: string,
    callbacks: UIControllerCallbacks
  ) {
    this.uiRootId = uiRootId;
    this.gameRootId = gameRootId;
    this.callbacks = callbacks;
    this.currentUIElement = null;
  }

  /**
   * Clear the UI root container
   */
  private clearUIRoot(): void {
    const uiRoot = document.getElementById(this.uiRootId);
    if (uiRoot) {
      UIView.clear(uiRoot);
    }
    this.currentUIElement = null;
  }

  /**
   * Show a UI component in the UI root
   */
  private showComponent(component: () => HTMLElement): Element | null {
    this.clearUIRoot();
    const uiRoot = document.getElementById(this.uiRootId);
    if (!uiRoot) {
      return null;
    }
    const element = component();
    UIView.render(element, uiRoot);
    this.currentUIElement = uiRoot.firstElementChild;
    return this.currentUIElement;
  }

  /**
   * Set display style for an element
   */
  private setDisplay(elementId: string, value: string): void {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = value;
    }
  }

  /**
   * Show the welcome screen with start/cancel/help buttons
   */
  showWelcomeScreen(): void {
    this.showComponent(UIView.WelcomeScreen);
    this.bindStartButton();
    this.bindCancelButton();
    this.bindHelpButton();
    this.hideGameRoot();
  }

  /**
   * Show the help screen
   */
  showHelpScreen(): void {
    this.showComponent(UIView.HelpScreen);
    this.bindBackFromHelpButton();
  }

  /**
   * Show the pre-game ad screen
   */
  showPreGameScreen(): void {
    this.showComponent(UIView.PreGameScreen);
    this.hideGameRoot();
  }

  /**
   * Hide the UI and show the game
   */
  showGame(): void {
    this.clearUIRoot();
    this.showGameRoot();
  }

  /**
   * Hide the game root
   */
  hideGameRoot(): void {
    this.setDisplay(this.gameRootId, 'none');
  }

  /**
   * Show the game root
   */
  showGameRoot(): void {
    this.setDisplay(this.gameRootId, 'block');
  }

  /**
   * Bind the start game button
   */
  private bindStartButton(): void {
    const btn = document.getElementById('btn-start-game');
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      this.callbacks.onStartGame();
    };
  }

  /**
   * Bind the cancel button
   */
  private bindCancelButton(): void {
    const btn = document.getElementById('btn-cancel-game');
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      this.callbacks.onCancelGame();
    };
  }

  /**
   * Bind the help button
   */
  private bindHelpButton(): void {
    const btn = document.getElementById('btn-help-game');
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      this.callbacks.onShowHelp();
    };
  }

  /**
   * Bind the back from help button
   */
  private bindBackFromHelpButton(): void {
    const helpContainer = document.querySelector('.help-prompt');
    if (!helpContainer) {
      return;
    }
    const backBtn = document.getElementById('btn-back-from-help');
    if (!backBtn) {
      return;
    }
    backBtn.onclick = () => {
      this.callbacks.onBackFromHelp();
    };
  }

  /**
   * Clear all UI
   */
  clear(): void {
    this.clearUIRoot();
  }

  /**
   * Get canvas and score elements from the DOM
   * @param canvasId - Canvas element ID
   * @returns Object containing canvas and score elements
   * @throws Error if canvas element is not found or is not a canvas
   */
  getGameElements(
    canvasId: string
  ): {
    canvas: HTMLCanvasElement;
    scoreElement: HTMLElement | null;
  } {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    const scoreElement = document.getElementById('score');

    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Element with id "${canvasId}" is not a canvas element`);
    }

    return { canvas, scoreElement };
  }
}