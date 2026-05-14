/**
 * Google Ad Manager (GPT — Google Publisher Tag).
 * Runs after the player taps “Yes, start” on the welcome screen.
 * Replace WORM_GAM_AD_UNIT with your inventory path from Ad Manager.
 * Docs: https://developers.google.com/publisher-tag/guides/get-started
 * Help: https://support.google.com/admanager
 *
 * Append ?nowormads=1 to the page URL to skip ads (local testing only).
 */
(function () {
  "use strict";

  var WORM_GAM_AD_UNIT = "/6355419/Travel/Europe/France/Paris";
  var SLOT_ELEMENT_ID = "div-gpt-ad-worm-prestart";
  var MIN_VIEW_MS_WITH_CREATIVE = 4500;
  var MIN_VIEW_MS_EMPTY = 900;

  var flowStarted = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(text) {
    var el = byId("ad-status");
    if (el) {
      el.textContent = text;
    }
  }

  function revealGame() {
    var pre = byId("pre-game");
    var root = byId("game-root");
    if (pre) {
      pre.style.display = "none";
    }
    if (root) {
      root.style.display = "block";
    }
    if (typeof window.wormStartGame === "function") {
      window.wormStartGame();
    }
  }

  function scheduleStart(delayMs) {
    window.setTimeout(function () {
      revealGame();
    }, delayMs);
  }

  function skipAdsPath() {
    if (!window.location || !window.location.search) {
      return false;
    }
    return window.location.search.indexOf("nowormads=1") !== -1;
  }

  function runGpt() {
    var slot;
    var unlockScheduled = false;

    function unlockOnce(delayMs) {
      if (unlockScheduled) {
        return;
      }
      unlockScheduled = true;
      scheduleStart(delayMs);
    }

    window.setTimeout(function () {
      unlockOnce(MIN_VIEW_MS_EMPTY);
    }, 15000);

    googletag.cmd.push(function () {
      slot = googletag
        .defineSlot(WORM_GAM_AD_UNIT, [[300, 250], [320, 50]], SLOT_ELEMENT_ID)
        .addService(googletag.pubads());

      googletag.pubads().addEventListener("slotRenderEnded", function (event) {
        if (!slot || event.slot !== slot) {
          return;
        }
        if (event.isEmpty) {
          setStatus("No ad available — starting the game shortly.");
          unlockOnce(MIN_VIEW_MS_EMPTY);
        } else {
          setStatus("Thanks for watching — the game will start in a few seconds.");
          unlockOnce(MIN_VIEW_MS_WITH_CREATIVE);
        }
      });

      googletag.pubads().collapseEmptyDivs(true);
      googletag.enableServices();
      googletag.display(SLOT_ELEMENT_ID);
    });
  }

  function runAdsThenGame() {
    if (skipAdsPath()) {
      setStatus("Ads skipped (dev).");
      scheduleStart(0);
      return;
    }
    setStatus("Loading ad…");
    runGpt();
  }

  window.wormRunAdsThenStartGame = function () {
    if (flowStarted) {
      return;
    }
    flowStarted = true;
    runAdsThenGame();
  };
}());
