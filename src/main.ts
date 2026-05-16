
// Import CSS
import '@static/reset.css';
import './styles.scss';

// Import ads module (IIFE that exports to window)
import './ads';

// Import Game class
import { Application } from './Application';

// Initialize game when DOM is loaded
(() => {
  const app = new Application({
    cell: 20,
    cols: 20,
    rows: 20,
    stepMs: 600,
    canvasId: 'board',
    scoreId: 'score',
    startButtonId: 'btn-start-game',
    gameRootId: 'game-root',
    uiRootId: 'ui-root'
  });

  app.init();
})();
