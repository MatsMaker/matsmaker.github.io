(function (global) {
  "use strict";

  function GameController(model, view, stepMs) {
    this.model = model;
    this.view = view;
    this.stepMs = typeof stepMs === "number" ? stepMs : 120;
    this.lastTick = 0;
    this.accum = 0;
    this.boundLoop = this.loop.bind(this);
    this.boundKeydown = this.onKeydown.bind(this);
    this.inputAttached = false;
    this.loopActive = false;
    this.onReturnToWelcome = null;
  }

  GameController.prototype.onKeydown = function (e) {
    var key = e.keyCode;
    if (key === 8) {
      e.preventDefault();
      if (!this.model.running && this.model.snake) {
        this.pauseForMenu();
        this.model.clear();
        if (typeof this.onReturnToWelcome === "function") {
          this.onReturnToWelcome();
        }
      }
      return;
    }
    if (!this.model.running) {
      return;
    }
    if (key === 37) {
      e.preventDefault();
      this.model.queueDirection(-1, 0);
    } else if (key === 38) {
      e.preventDefault();
      this.model.queueDirection(0, -1);
    } else if (key === 39) {
      e.preventDefault();
      this.model.queueDirection(1, 0);
    } else if (key === 40) {
      e.preventDefault();
      this.model.queueDirection(0, 1);
    }
  };

  GameController.prototype.loop = function (now) {
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
  };

  GameController.prototype.pauseForMenu = function () {
    this.loopActive = false;
  };

  GameController.prototype.start = function () {
    this.loopActive = true;
    this.model.reset();
    this.lastTick = 0;
    this.accum = 0;
    if (!this.inputAttached) {
      this.inputAttached = true;
      window.addEventListener("keydown", this.boundKeydown, false);
    }
    window.requestAnimationFrame(this.boundLoop);
  };

  global.GameController = GameController;
}(typeof window !== "undefined" ? window : this));
