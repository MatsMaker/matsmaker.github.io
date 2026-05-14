(function () {
  "use strict";

  var game = new Game({
    cell: 20,
    cols: 20,
    rows: 20,
    stepMs: 120,
    canvasId: "board",
    scoreId: "score",
    startButtonId: "btn-start-game",
    welcomeId: "welcome-screen",
    preGameId: "pre-game",
    gameRootId: "game-root"
  });

  game.init();
}());
