/**
 * Google Ad Manager (GPT — Google Publisher Tag).
 * Runs after the player taps “Yes, start” on the welcome screen.
 * Replace SNAKE_GAM_AD_UNIT with your inventory path from Ad Manager.
 * Docs: https://developers.google.com/publisher-tag/guides/get-started
 * Help: https://support.google.com/admanager
 *
 * Append ?nosnakeads=1 to the page URL to skip ads (local testing only).
 */
(function () {
  "use strict";

  var SNAKE_GAM_AD_UNIT = "/6355419/Travel/Europe/France/Paris";
  var SLOT_ELEMENT_ID = "div-gpt-ad-snake-prestart";
  var MIN_VIEW_MS_WITH_CREATIVE = 4500;
  var MIN_VIEW_MS_EMPTY = 900;

  var gptSlot = null;
  var gptListenerAttached = false;
  var safetyTimerId = null;
  var revealTimeoutId = null;
  var revealScheduled = false;
  var adsBusy = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(text) {
    var el = byId("ad-status");
    if (el) {
      el.textContent = text;
    }
  }

  function clearSafetyTimer() {
    if (safetyTimerId !== null) {
      window.clearTimeout(safetyTimerId);
      safetyTimerId = null;
    }
  }

  function cancelRevealTimer() {
    if (revealTimeoutId !== null) {
      window.clearTimeout(revealTimeoutId);
      revealTimeoutId = null;
    }
  }

  function revealGame() {
    clearSafetyTimer();
    cancelRevealTimer();
    var pre = byId("pre-game");
    var root = byId("game-root");
    if (pre) {
      pre.style.display = "none";
    }
    if (root) {
      root.style.display = "block";
    }
    if (typeof window.snakeStartGame === "function") {
      window.snakeStartGame();
    }
    adsBusy = false;
    revealScheduled = false;
  }

  function scheduleReveal(delayMs) {
    if (revealScheduled) {
      return;
    }
    revealScheduled = true;
    clearSafetyTimer();
    revealTimeoutId = window.setTimeout(function () {
      revealTimeoutId = null;
      revealGame();
    }, delayMs);
  }

  function skipAdsPath() {
    if (!window.location || !window.location.search) {
      return false;
    }
    return window.location.search.indexOf("nosnakeads=1") !== -1;
  }

  function onSlotRenderEnded(event) {
    if (!gptSlot || event.slot !== gptSlot) {
      return;
    }
    if (event.isEmpty) {
      setStatus("No ad available — starting the game shortly.");
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    } else {
      setStatus("Thanks for watching — the game will start in a few seconds.");
      scheduleReveal(MIN_VIEW_MS_WITH_CREATIVE);
    }
  }

  function runGpt() {
    clearSafetyTimer();
    revealScheduled = false;
    cancelRevealTimer();

    safetyTimerId = window.setTimeout(function () {
      safetyTimerId = null;
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }, 15000);

    googletag.cmd.push(function () {
      if (!gptSlot) {
        gptSlot = googletag
          .defineSlot(SNAKE_GAM_AD_UNIT, [[300, 250], [320, 50]], SLOT_ELEMENT_ID)
          .addService(googletag.pubads());
        if (!gptListenerAttached) {
          googletag.pubads().addEventListener("slotRenderEnded", onSlotRenderEnded);
          gptListenerAttached = true;
        }
        googletag.pubads().collapseEmptyDivs(true);
        googletag.enableServices();
        googletag.display(SLOT_ELEMENT_ID);
      } else {
        googletag.pubads().refresh([gptSlot]);
      }
    });
  }

  function runAdsThenGame() {
    if (skipAdsPath()) {
      setStatus("Ads skipped (dev).");
      scheduleReveal(0);
      return;
    }
    setStatus("Loading ad…");
    runGpt();
  }

  window.snakeRunAdsThenStartGame = function () {
    if (adsBusy) {
      return;
    }
    adsBusy = true;
    runAdsThenGame();
  };

  window.snakeResetAdsFlow = function () {
    adsBusy = false;
    revealScheduled = false;
    clearSafetyTimer();
    cancelRevealTimer();
  };
}());
