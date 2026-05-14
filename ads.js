/**
 * Google IMA SDK for video ads.
 * Runs after the player taps "Yes, start" on the welcome screen.
 * Using Google's test video ad tag for development/testing.
 * Docs: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side
 * Test Tags: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/tags
 *
 * Append ?nosnakeads=1 to the page URL to skip ads (local testing only).
 */
(function () {
  "use strict";

  // Google IMA test video ad tag - VAST format
  var SNAKE_VIDEO_AD_TAG = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";
  var MIN_VIEW_MS_WITH_CREATIVE = 1000;
  var MIN_VIEW_MS_EMPTY = 900;

  var adDisplayContainer = null;
  var adsLoader = null;
  var adsManager = null;
  var videoElement = null;
  var adContainerElement = null;
  var safetyTimerId = null;
  var revealTimeoutId = null;
  var revealScheduled = false;
  var adsBusy = false;
  var adPlaying = false;

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

  function onAdError(adErrorEvent) {
    console.log("Ad error:", adErrorEvent.getError());
    setStatus("Ad could not be loaded — starting the game shortly.");
    if (adsManager) {
      adsManager.destroy();
    }
    scheduleReveal(MIN_VIEW_MS_EMPTY);
  }

  function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }
    try {
      adsManager.init(640, 480, google.ima.ViewMode.NORMAL);
      adsManager.start();
      adPlaying = true;
    } catch (adError) {
      console.log("AdsManager start error:", adError);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  }

  function onAdStarted() {
    setStatus("Playing ad — game will start after...");
  }

  function onAdComplete() {
    setStatus("Thanks for watching!");
    scheduleReveal(MIN_VIEW_MS_WITH_CREATIVE);
  }

  function onAdsManagerLoaded(adsManagerLoadedEvent) {
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, adsRenderingSettings);

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdLoaded);
    adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted);
    adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete);
    adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdComplete);
    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdComplete);
  }

  function initIMA() {
    videoElement = byId("ad-video");
    adContainerElement = byId("ad-container");

    if (!videoElement || !adContainerElement) {
      console.error("Video or ad container element not found");
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }

    adDisplayContainer = new google.ima.AdDisplayContainer(adContainerElement, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
  }

  function requestAds() {
    if (!adsLoader) {
      initIMA();
    }

    adDisplayContainer.initialize();

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = SNAKE_VIDEO_AD_TAG + Date.now();
    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 480;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    adsLoader.requestAds(adsRequest);
  }

  function runVideoAd() {
    clearSafetyTimer();
    revealScheduled = false;
    cancelRevealTimer();
    adPlaying = false;

    safetyTimerId = window.setTimeout(function () {
      safetyTimerId = null;
      if (!adPlaying) {
        setStatus("Ad timed out — starting the game.");
        scheduleReveal(0);
      }
    }, 15000);

    try {
      requestAds();
    } catch (e) {
      console.error("Error requesting ads:", e);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  }

  function runAdsThenGame() {
    if (skipAdsPath()) {
      setStatus("Ads skipped (dev).");
      scheduleReveal(0);
      return;
    }
    if (typeof google === "undefined" || !google.ima) {
      setStatus("IMA SDK not loaded — starting game.");
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }
    setStatus("Loading video ad…");
    runVideoAd();
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
    adPlaying = false;
    clearSafetyTimer();
    cancelRevealTimer();
    if (adsManager) {
      adsManager.destroy();
      adsManager = null;
    }
  };
}());
