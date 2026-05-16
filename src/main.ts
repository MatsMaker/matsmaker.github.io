
// Import CSS
import '@static/reset.css';
import './styles.scss';

// Import Game class
import { Application } from './Application';
import { GAME_CONFIG, DOM_IDS } from './config';

// Initialize game when DOM is loaded
(() => {
  try {
    const app = new Application({
      cell: GAME_CONFIG.CELL_SIZE,
      cols: GAME_CONFIG.GRID_COLS,
      rows: GAME_CONFIG.GRID_ROWS,
      stepMs: GAME_CONFIG.STEP_MS,
      canvasId: DOM_IDS.CANVAS,
      scoreId: DOM_IDS.SCORE,
      startButtonId: DOM_IDS.START_BUTTON,
      gameRootId: DOM_IDS.GAME_ROOT,
      uiRootId: DOM_IDS.UI_ROOT
    });

    app.init();
  } catch (error) {
    console.error('Failed to initialize Snake Game:', error);
    
    // Show error message to user
    const body = document.body;
    if (body) {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #7a3d3d; color: #fff; padding: 20px; border-radius: 6px; font-family: Georgia, serif; text-align: center;';
      errorDiv.innerHTML = `
        <h2>Game Failed to Load</h2>
        <p>Please refresh the page or check the console for details.</p>
      `;
      body.appendChild(errorDiv);
    }
  }
})();
