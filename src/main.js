"use strict";

// Import CSS
import '../static/reset.css';
import '../static/styles.css';

// Import ads module (IIFE that exports to window)
import './ads.js';

// Import Game class
import { Game } from './game.js';

// Initialize game when DOM is loaded
(function () {
  var game = new Game({
    cell: 20,
    cols: 20,
    rows: 20,
    stepMs: 600,
    canvasId: "board",
    scoreId: "score",
    startButtonId: "btn-start-game",
    welcomeId: "welcome-screen",
    preGameId: "pre-game",
    gameRootId: "game-root"
  });

  game.init();
}());
