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
  // ============================================================================
  // Constants
  // ============================================================================
  
  private readonly SNAKE_VIDEO_AD_TAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  private readonly MIN_VIEW_MS_WITH_CREATIVE = 1000;
  private readonly MIN_VIEW_MS_EMPTY = 900;
  private readonly AD_REQUEST_TIMEOUT_MS = 8000;

  // ============================================================================
  // State
  // ============================================================================
  
  // Google IMA SDK state
  private adDisplayContainer: any = null;
  private adsLoader: any = null;
  private adsManager: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private adContainerElement: HTMLElement | null = null;

  // Flow control state
  private safetyTimerId: number | null = null;
  private revealTimeoutId: number | null = null;
  private revealScheduled = false;
  private adsBusy = false;
  private adPlaying = false;
  private gameStartResolve: (() => void) | null = null;

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Start the ad flow, returning a Promise that resolves when ready to start game.
   */
  public runAdsThenStartGame(): Promise<void> {
    if (this.adsBusy) {
      return Promise.resolve();
    }
    this.adsBusy = true;
    
    return new Promise<void>((resolve) => {
      this.gameStartResolve = resolve;
      this.startAdFlow();
    });
  }

  /**
   * Clean up and reset all ad state.
   */
  public resetAdsFlow(): void {
    this.adsBusy = false;
    this.revealScheduled = false;
    this.adPlaying = false;
    this.clearTimers();
    
    if (this.gameStartResolve) {
      this.gameStartResolve = null;
    }
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
  }

  // ============================================================================
  // Ad Flow Control
  // ============================================================================

  private startAdFlow(): void {
    if (this.shouldSkipAds()) {
      console.log('Snake Ads: Skipping ads (dev mode)');
      this.setStatus('Ads skipped (dev).');
      this.scheduleReveal(0);
      return;
    }

    if (!this.isIMASDKAvailable()) {
      console.error('Snake Ads: IMA SDK not loaded - check HTTPS, ad blockers, or network');
      this.setStatus('IMA SDK not loaded — starting game.');
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
      return;
    }

    console.log('Snake Ads: Starting ad request...');
    this.setStatus('Loading video ad…');
    this.runVideoAd();
  }

  private runVideoAd(): void {
    this.clearTimers();
    this.revealScheduled = false;
    this.adPlaying = false;

    this.startSafetyTimeout();

    try {
      this.requestAds();
    } catch (e) {
      console.error('Error requesting ads:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  }

  private revealGame(): void {
    this.clearTimers();
    this.hideAdUI();
    this.showGameUI();
    this.resolveGameStart();
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

  // ============================================================================
  // Google IMA SDK Integration
  // ============================================================================

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

    this.adDisplayContainer = new google.ima.AdDisplayContainer(
      this.adContainerElement,
      this.videoElement
    );
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

    this.attachLoaderListeners();
    console.log('Snake Ads: IMA SDK initialized successfully');
  }

  private attachLoaderListeners(): void {
    const google = window.google;
    if (!google) return;

    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded,
      false
    );
    this.adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError,
      false
    );
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
    
    this.initializeAdContainer();
    
    const adsRequest = this.createAdsRequest();
    
    try {
      this.adsLoader.requestAds(adsRequest);
      console.log('Snake Ads: Request sent, waiting for response...');
    } catch (e) {
      console.error('Snake Ads: Failed to request ads:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  }

  private initializeAdContainer(): void {
    try {
      this.adDisplayContainer.initialize();
      console.log('Snake Ads: Ad display container initialized');
    } catch (e) {
      console.error('Snake Ads: Failed to initialize ad display container:', e);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
  }

  private createAdsRequest(): any {
    const google = window.google;
    const adsRequest = new google.ima.AdsRequest();
    
    adsRequest.adTagUrl = this.SNAKE_VIDEO_AD_TAG + Date.now();
    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 480;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;
    
    return adsRequest;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  private onAdsManagerLoaded = (adsManagerLoadedEvent: any): void => {
    console.log('Snake Ads: AdsManager loaded successfully');
    const google = window.google;
    if (!google) return;
    
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    
    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.videoElement,
      adsRenderingSettings
    );

    this.attachAdEventListeners();
    this.startAdsManager();
  };

  private attachAdEventListeners(): void {
    const google = window.google;
    if (!google) return;

    this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdLoaded);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdStarted);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdComplete);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onAdComplete);
    this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAdComplete);
    
    console.log('Snake Ads: All event listeners attached');
  }

  private startAdsManager(): void {
    const google = window.google;
    if (!google) return;

    try {
      console.log('Snake Ads: Initializing and starting adsManager...');
      this.adsManager.init(640, 480, google.ima.ViewMode.NORMAL);
      this.adsManager.start();
      console.log('Snake Ads: AdsManager started successfully');
    } catch (adError) {
      console.error('Snake Ads: Error starting adsManager:', adError);
      this.scheduleReveal(this.MIN_VIEW_MS_EMPTY);
    }
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

  // ============================================================================
  // Utilities & Helpers
  // ============================================================================

  private startSafetyTimeout(): void {
    this.safetyTimerId = window.setTimeout(() => {
      this.safetyTimerId = null;
      if (!this.adPlaying) {
        console.warn(`Snake Ads: Timeout (${this.AD_REQUEST_TIMEOUT_MS / 1000}s) - no ad response from Google`);
        console.warn('Snake Ads: This is normal - test ad tags don\'t always have available ads');
        this.setStatus('No ad available — starting the game.');
        this.scheduleReveal(0);
      }
    }, this.AD_REQUEST_TIMEOUT_MS);
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

  private clearTimers(): void {
    this.clearSafetyTimer();
    this.cancelRevealTimer();
  }

  private hideAdUI(): void {
    const uiRoot = document.getElementById('ui-root');
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
  }

  private showGameUI(): void {
    const root = document.getElementById('game-root');
    if (root) {
      root.style.display = 'block';
    }
  }

  private resolveGameStart(): void {
    if (this.gameStartResolve) {
      this.gameStartResolve();
      this.gameStartResolve = null;
    }
  }

  private shouldSkipAds(): boolean {
    return window.location?.search?.includes('nosnakeads=1') ?? false;
  }

  private isIMASDKAvailable(): boolean {
    return !!window.google?.ima;
  }

  private byId(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  private setStatus(text: string): void {
    const el = this.byId('ad-status');
    if (el) {
      el.textContent = text;
    }
  }
}
