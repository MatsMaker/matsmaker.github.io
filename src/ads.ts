/**
 * Google IMA SDK for video ads.
 * Runs after the player taps "Yes, start" on the welcome screen.
 * Using Google's test video ad tag for development/testing.
 * Docs: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side
 * Test Tags: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/tags
 *
 * Append ?nosnakeads=1 to the page URL to skip ads (local testing only).
 */

(() => {
  // Google IMA test video ad tag - VAST format
  // NOTE: Test tags may not always have available ads - this is normal behavior
  // For production, replace with your own Google Ad Manager ad tag
  const SNAKE_VIDEO_AD_TAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  const MIN_VIEW_MS_WITH_CREATIVE = 1000;
  const MIN_VIEW_MS_EMPTY = 900;
  const AD_REQUEST_TIMEOUT_MS = 8000; // Reduced from 15s - test ads often have no inventory

  let adDisplayContainer: any = null;
  let adsLoader: any = null;
  let adsManager: any = null;
  let videoElement: HTMLVideoElement | null = null;
  let adContainerElement: HTMLElement | null = null;
  let safetyTimerId: number | null = null;
  let revealTimeoutId: number | null = null;
  let revealScheduled = false;
  let adsBusy = false;
  let adPlaying = false;

  const byId = (id: string): HTMLElement | null => document.getElementById(id);

  const setStatus = (text: string): void => {
    const el = byId('ad-status');
    if (el) {
      el.textContent = text;
    }
  };

  const clearSafetyTimer = (): void => {
    if (safetyTimerId !== null) {
      window.clearTimeout(safetyTimerId);
      safetyTimerId = null;
    }
  };

  const cancelRevealTimer = (): void => {
    if (revealTimeoutId !== null) {
      window.clearTimeout(revealTimeoutId);
      revealTimeoutId = null;
    }
  };

  const revealGame = (): void => {
    clearSafetyTimer();
    cancelRevealTimer();
    const uiRoot = document.getElementById('ui-root');
    const root = document.getElementById('game-root');
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
    if (root) {
      root.style.display = 'block';
    }
    if (typeof window.snakeStartGame === 'function') {
      window.snakeStartGame();
    }
    adsBusy = false;
    revealScheduled = false;
  };

  const scheduleReveal = (delayMs: number): void => {
    if (revealScheduled) {
      return;
    }
    revealScheduled = true;
    clearSafetyTimer();
    revealTimeoutId = window.setTimeout(() => {
      revealTimeoutId = null;
      revealGame();
    }, delayMs);
  };

  const skipAdsPath = (): boolean => {
    if (!window.location || !window.location.search) {
      return false;
    }
    return window.location.search.indexOf('nosnakeads=1') !== -1;
  };

  const onAdError = (adErrorEvent: any): void => {
    const error = adErrorEvent.getError();
    console.error('Snake Ads: Ad error -', error.getErrorCode(), error.getMessage());
    console.error('Snake Ads: Error details:', error);
    setStatus('Ad could not be loaded — starting the game shortly.');
    if (adsManager) {
      adsManager.destroy();
    }
    scheduleReveal(MIN_VIEW_MS_EMPTY);
  };

  const onAdLoaded = (adEvent: any): void => {
    const ad = adEvent.getAd();
    console.log('Snake Ads: Ad LOADED event - isLinear:', ad.isLinear());
    if (!ad.isLinear()) {
      console.log('Snake Ads: Non-linear ad - skipping to game');
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  };

  const onAdStarted = (): void => {
    console.log('Snake Ads: Ad STARTED event fired - video is now playing!');
    adPlaying = true;
    setStatus('Playing ad — game will start after...');
  };

  const onAdComplete = (): void => {
    console.log('Snake Ads: Ad COMPLETE/SKIPPED event fired');
    setStatus('Thanks for watching!');
    scheduleReveal(MIN_VIEW_MS_WITH_CREATIVE);
  };

  const onAdsManagerLoaded = (adsManagerLoadedEvent: any): void => {
    console.log('Snake Ads: AdsManager loaded successfully');
    const google = window.google;
    if (!google) return;
    
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, adsRenderingSettings);

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdLoaded);
    adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted);
    adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete);
    adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdComplete);
    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdComplete);
    console.log('Snake Ads: All event listeners attached');
    
    // Start the ads manager to trigger ad events
    try {
      console.log('Snake Ads: Initializing and starting adsManager...');
      adsManager.init(640, 480, google.ima.ViewMode.NORMAL);
      adsManager.start();
      console.log('Snake Ads: AdsManager started successfully');
    } catch (adError) {
      console.error('Snake Ads: Error starting adsManager:', adError);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  };

  const initIMA = (): void => {
    console.log('Snake Ads: Initializing IMA SDK...');
    videoElement = byId('ad-video') as HTMLVideoElement | null;
    adContainerElement = byId('ad-container');

    if (!videoElement || !adContainerElement) {
      console.error('Video or ad container element not found');
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }

    const google = window.google;
    if (!google) return;

    adDisplayContainer = new google.ima.AdDisplayContainer(adContainerElement, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
    console.log('Snake Ads: IMA SDK initialized successfully');
  };

  const requestAds = (): void => {
    if (!adsLoader) {
      initIMA();
    }
    
    console.log('Snake Ads: Requesting ads from:', SNAKE_VIDEO_AD_TAG);
    
    const google = window.google;
    if (!google) {
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }
    
    try {
      adDisplayContainer.initialize();
      console.log('Snake Ads: Ad display container initialized');
    } catch (e) {
      console.error('Snake Ads: Failed to initialize ad display container:', e);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }

    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = SNAKE_VIDEO_AD_TAG + Date.now();
    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 480;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    console.log('Snake Ads: Sending ads request to Google...');
    try {
      adsLoader.requestAds(adsRequest);
      console.log('Snake Ads: Request sent, waiting for response...');
    } catch (e) {
      console.error('Snake Ads: Failed to request ads:', e);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  };

  const runVideoAd = (): void => {
    clearSafetyTimer();
    revealScheduled = false;
    cancelRevealTimer();
    adPlaying = false;

    safetyTimerId = window.setTimeout(() => {
      safetyTimerId = null;
      if (!adPlaying) {
        console.warn(`Snake Ads: Timeout (${AD_REQUEST_TIMEOUT_MS / 1000}s) - no ad response from Google`);
        console.warn('Snake Ads: This is normal - test ad tags don\'t always have available ads');
        setStatus('No ad available — starting the game.');
        scheduleReveal(0);
      }
    }, AD_REQUEST_TIMEOUT_MS);

    try {
      requestAds();
    } catch (e) {
      console.error('Error requesting ads:', e);
      scheduleReveal(MIN_VIEW_MS_EMPTY);
    }
  };

  const runAdsThenGame = (): void => {
    if (skipAdsPath()) {
      console.log('Snake Ads: Skipping ads (dev mode)');
      setStatus('Ads skipped (dev).');
      scheduleReveal(0);
      return;
    }
    if (!window.google?.ima) {
      console.error('Snake Ads: IMA SDK not loaded - check HTTPS, ad blockers, or network');
      setStatus('IMA SDK not loaded — starting game.');
      scheduleReveal(MIN_VIEW_MS_EMPTY);
      return;
    }
    console.log('Snake Ads: Starting ad request...');
    setStatus('Loading video ad…');
    runVideoAd();
  };

  window.snakeRunAdsThenStartGame = () => {
    if (adsBusy) {
      return;
    }
    adsBusy = true;
    runAdsThenGame();
  };

  window.snakeResetAdsFlow = () => {
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
})();
