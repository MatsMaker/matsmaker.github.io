
// Import CSS
import '@static/reset.css';
import './styles.scss';

// Import ads module (IIFE that exports to window)
import './ads';

// Import Game class
import Game from './Game';

// Initialize game when DOM is loaded
(() => {
  const game = new Game({
    cell: 20,
    cols: 20,
    rows: 20,
    stepMs: 600,
    canvasId: 'board',
    scoreId: 'score',
    startButtonId: 'btn-start-game',
    gameRootId: 'game-root'
  });

  game.init();
})();
