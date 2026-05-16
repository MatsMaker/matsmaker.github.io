/**
 * Google IMA SDK for video ads.
 * Runs after the player taps "Yes, start" on the welcome screen.
 * Using Google's test video ad tag for development/testing.
 * Docs: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side
 * Test Tags: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/tags
 *
 * Append ?nosnakeads=1 to the page URL to skip ads (local testing only).
 */

export class AdsManager {
  // Google IMA test video ad tag - VAST format
  // NOTE: Test tags may not always have available ads - this is normal behavior
  // For production, replace with your own Google Ad Manager ad tag
  private readonly SNAKE_VIDEO_AD_TAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  private readonly MIN_VIEW_MS_WITH_CREATIVE = 1000;
  private readonly MIN_VIEW_MS_EMPTY = 900;
  private readonly AD_REQUEST_TIMEOUT_MS = 8000; // Reduced from 15s - test ads often have no inventory

  private adDisplayContainer: any = null;
  private adsLoader: any = null;
  private adsManager: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private adContainerElement: HTMLElement | null = null;
  private safetyTimerId: number | null = null;
  private revealTimeoutId: number | null = null;
  private revealScheduled = false;
  private adsBusy = false;
  private adPlaying = false;

  private byId(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  private setStatus(text: string): void {
    const el = this.byId('ad-status');
    if (el) {
      el.textContent = text;
    }
  }

  private clearSafetyTimer(): void {
    if (this.safetyTimerId !== null) {
      window.clearTimeout(this.safetyTimerId);
      this.safetyTimerId = null;
    }
  }

  private cancelRevealTimer(): void {
    if (this.revealTimeoutId !== null) {
      window.clearTimeout(this.revealTimeoutId);
      this.revealTimeoutId = null;
    }
  }

  private revealGame(): void {
    this.clearSafetyTimer();
    this.cancelRevealTimer();
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
    this.adsBusy = false;
    this.revealScheduled = false;
  }

  private scheduleReveal(delayMs: number): void {
    if (this.revealScheduled) {
      return;
    }
    this.revealScheduled = true;
    this.clearSafetyTimer();
    this.revealTimeoutId = window.setTimeout(() => {
      this.revealTimeoutId = null;
      this.revealGame();
    }, delayMs);
  }

  private skipAdsPath(): boolean {
    if (!window.location || !window.location.search) {
      return false;
    }
    return window.location.search.indexOf('nosnakeads=1') !== -1;
  }

  private onAdError = (adErrorEvent: any): void => {
    const error = adErrorEvent.getError();
    console.error('Snake Ads: Ad error -', error.getErrorCode(), error.getMessage());
    console.error('Snake Ads: Error details:', error);
    this.setStatus('Ad could not be loaded — starting the game shortly.');
    if (this.adsManager) {
      this.adsManager.destroy();
    }
    this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
  };

  private onAdLoaded = (adEvent: any): void => {
    const ad = adEvent.getAd();
    console.log('Snake Ads: Ad LOADED event - isLinear:', ad.isLinear());
    if (!ad.isLinear()) {
      console.log('Snake Ads: Non-linear ad - skipping to game');
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  };

  private onAdStarted = (): void => {
    console.log('Snake Ads: Ad STARTED event fired - video is now playing!');
    this.adPlaying = true;
    this.setStatus('Playing ad — game will start after...');
  };

  private onAdComplete = (): void => {
    console.log('Snake Ads: Ad COMPLETE/SKIPPED event fired');
    this.setStatus('Thanks for watching!');
    this.scheduleReveal(this.MIN_VIEW_MS_WITH_CREATIVE);
  };

  private onAdsManagerLoaded = (adsManagerLoadedEvent: any): void => {
    console.log('Snake Ads: AdsManager loaded successfully');
    const google = window.google;
    if (!google) return;
    
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this.videoElement, adsRenderingSettings);

    this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdLoaded);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdStarted);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdComplete);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onAdComplete);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAdComplete);
    console.log('Snake Ads: All event listeners attached');
    
    // Start the ads manager to trigger ad events
    try {
      console.log('Snake Ads: Initializing and starting adsManager...');
      this.adsManager.init(640, 480, google.ima.ViewMode.NORMAL);
      this.adsManager.start();
      console.log('Snake Ads: AdsManager started successfully');
    } catch (adError) {
      console.error('Snake Ads: Error starting adsManager:', adError);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  };

  private initIMA(): void {
    console.log('Snake Ads: Initializing IMA SDK...');
    this.videoElement = this.byId('ad-video') as HTMLVideoElement | null;
    this.adContainerElement = this.byId('ad-container');

    if (!this.videoElement || !this.adContainerElement) {
      console.error('Video or ad container element not found');
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
      return;
    }

    const google = window.google;
    if (!google) return;

    this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainerElement, this.videoElement);
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

    this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded, false);
    this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false);
    console.log('Snake Ads: IMA SDK initialized successfully');
  }

  private requestAds(): void {
    if (!this.adsLoader) {
      this.initIMA();
    }
    
    console.log('Snake Ads: Requesting ads from:', this.SNAKE_VIDEO_AD_TAG);
    
    const google = window.google;
    if (!google) {
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
      return;
    }
    
    try {
      this.adDisplayContainer.initialize();
      console.log('Snake Ads: Ad display container initialized');
    } catch (e) {
      console.error('Snake Ads: Failed to initialize ad display container:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
      return;
    }

    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = this.SNAKE_VIDEO_AD_TAG + Date.now();
    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 480;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    console.log('Snake Ads: Sending ads request to Google...');
    try {
      this.adsLoader.requestAds(adsRequest);
      console.log('Snake Ads: Request sent, waiting for response...');
    } catch (e) {
      console.error('Snake Ads: Failed to request ads:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  }

  private runVideoAd(): void {
    this.clearSafetyTimer();
    this.revealScheduled = false;
    this.cancelRevealTimer();
    this.adPlaying = false;

    this.safetyTimerId = window.setTimeout(() => {
      this.safetyTimerId = null;
      if (!this.adPlaying) {
        console.warn(`Snake Ads: Timeout (${this.AD_REQUEST_TIMEOUT_MS / 1000}s) - no ad response from Google`);
        console.warn('Snake Ads: This is normal - test ad tags don\'t always have available ads');
        this.setStatus('No ad available — starting the game.');
        this.scheduleReveal(0);
      }
    }, this.AD_REQUEST_TIMEOUT_MS);

    try {
      this.requestAds();
    } catch (e) {
      console.error('Error requesting ads:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  }

  private runAdsThenGame(): void {
    if (this.skipAdsPath()) {
      console.log('Snake Ads: Skipping ads (dev mode)');
      this.setStatus('Ads skipped (dev).');
      this.scheduleReveal(0);
      return;
    }
    if (!window.google?.ima) {
      console.error('Snake Ads: IMA SDK not loaded - check HTTPS, ad blockers, or network');
      this.setStatus('IMA SDK not loaded — starting game.');
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
      return;
    }
    console.log('Snake Ads: Starting ad request...');
    this.setStatus('Loading video ad…');
    this.runVideoAd();
  }

  public runAdsThenStartGame(): void {
    if (this.adsBusy) {
      return;
    }
    this.adsBusy = true;
    this.runAdsThenGame();
  }

  public resetAdsFlow(): void {
    this.adsBusy = false;
    this.revealScheduled = false;
    this.adPlaying = false;
    this.clearSafetyTimer();
    this.cancelRevealTimer();
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
  }
}
