import { AD_CONFIG } from './AdConfig';

/**
 * Handles Google IMA SDK integration for video ads
 */
export class IMAAdPlayer {
  private adDisplayContainer: google.ima.AdDisplayContainer | null = null;
  private adsLoader: google.ima.AdsLoader | null = null;
  private adsManager: google.ima.AdsManager | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private adContainerElement: HTMLElement | null = null;
  private isInitialized = false;

  // Callbacks
  onAdLoaded?: () => void;
  onAdStarted?: () => void;
  onAdComplete?: () => void;
  onAdError?: (error: string) => void;

  /**
   * Initialize IMA SDK with DOM elements
   */
  initialize(): boolean {
    if (this.isInitialized) {
      return true;
    }

    if (!this.isIMASDKAvailable()) {
      console.error('IMA SDK not available');
      return false;
    }

    this.videoElement = document.getElementById(AD_CONFIG.DOM_IDS.AD_VIDEO) as HTMLVideoElement | null;
    this.adContainerElement = document.getElementById(AD_CONFIG.DOM_IDS.AD_CONTAINER);

    if (!this.videoElement || !this.adContainerElement) {
      console.error('Video or ad container element not found');
      return false;
    }

    const google = window.google;
    if (!google) return false;

    try {
      this.adDisplayContainer = new google.ima.AdDisplayContainer(
        this.adContainerElement,
        this.videoElement
      );
      
      this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
      this.attachLoaderListeners();
      
      this.isInitialized = true;
      console.log('IMA SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize IMA SDK:', error);
      return false;
    }
  }

  /**
   * Request ads from Google
   */
  requestAds(): boolean {
    if (!this.isInitialized && !this.initialize()) {
      return false;
    }

    if (!this.adsLoader || !this.adDisplayContainer) {
      return false;
    }

    const google = window.google;
    if (!google) return false;

    try {
      // Initialize ad display container
      this.adDisplayContainer.initialize();
      console.log('Ad display container initialized');

      // Create ads request
      const adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = AD_CONFIG.VIDEO_AD_TAG + Date.now();
      adsRequest.linearAdSlotWidth = AD_CONFIG.AD_DIMENSIONS.WIDTH;
      adsRequest.linearAdSlotHeight = AD_CONFIG.AD_DIMENSIONS.HEIGHT;
      adsRequest.nonLinearAdSlotWidth = AD_CONFIG.NON_LINEAR_AD_DIMENSIONS.WIDTH;
      adsRequest.nonLinearAdSlotHeight = AD_CONFIG.NON_LINEAR_AD_DIMENSIONS.HEIGHT;

      // Request ads
      this.adsLoader.requestAds(adsRequest);
      console.log('Ads requested from:', AD_CONFIG.VIDEO_AD_TAG);
      return true;
    } catch (error) {
      console.error('Failed to request ads:', error);
      return false;
    }
  }

  /**
   * Clean up and destroy IMA resources
   */
  destroy(): void {
    if (this.adsManager) {
      try {
        this.adsManager.destroy();
      } catch (error) {
        console.error('Error destroying ads manager:', error);
      }
      this.adsManager = null;
    }

    if (this.adsLoader) {
      try {
        this.adsLoader.destroy();
      } catch (error) {
        console.error('Error destroying ads loader:', error);
      }
      this.adsLoader = null;
    }

    if (this.adDisplayContainer) {
      try {
        this.adDisplayContainer.destroy();
      } catch (error) {
        console.error('Error destroying ad display container:', error);
      }
      this.adDisplayContainer = null;
    }

    this.isInitialized = false;
  }

  /**
   * Check if Google IMA SDK is available
   */
  private isIMASDKAvailable(): boolean {
    return !!window.google?.ima;
  }

  /**
   * Attach event listeners to ads loader
   */
  private attachLoaderListeners(): void {
    if (!this.adsLoader) return;

    const google = window.google;
    if (!google) return;

    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.handleAdsManagerLoaded,
      false
    );

    this.adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.handleAdError,
      false
    );
  }

  /**
   * Handle ads manager loaded event
   */
  private handleAdsManagerLoaded = (event: google.ima.AdsManagerLoadedEvent): void => {
    console.log('AdsManager loaded successfully');
    
    const google = window.google;
    if (!google) return;

    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

    this.adsManager = event.getAdsManager(
      this.videoElement as object,
      adsRenderingSettings
    );

    this.attachAdEventListeners();
    this.startAdsManager();
  };

  /**
   * Attach event listeners to ads manager
   */
  private attachAdEventListeners(): void {
    if (!this.adsManager) return;

    const google = window.google;
    if (!google) return;

    this.adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.handleAdError
    );
    
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      this.handleAdLoaded
    );
    
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      this.handleAdStarted
    );
    
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      this.handleAdComplete
    );
    
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.SKIPPED,
      this.handleAdComplete
    );
    
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      this.handleAdComplete
    );

    console.log('All event listeners attached');
  }

  /**
   * Start the ads manager
   */
  private startAdsManager(): void {
    if (!this.adsManager) return;

    const google = window.google;
    if (!google) return;

    try {
      console.log('Initializing and starting adsManager...');
      this.adsManager.init(
        AD_CONFIG.AD_DIMENSIONS.WIDTH,
        AD_CONFIG.AD_DIMENSIONS.HEIGHT,
        google.ima.ViewMode.NORMAL
      );
      this.adsManager.start();
      console.log('AdsManager started successfully');
    } catch (error) {
      console.error('Error starting adsManager:', error);
      this.onAdError?.('Failed to start ads manager');
    }
  }

  /**
   * Handle ad loaded event
   */
  private handleAdLoaded = (event: google.ima.AdEvent): void => {
    const ad = event.getAd();
    if (!ad) {
      console.log('Ad LOADED event - no ad object');
      this.onAdComplete?.();
      return;
    }
    
    console.log('Ad LOADED event - isLinear:', ad.isLinear());

    if (!ad.isLinear()) {
      console.log('Non-linear ad - skipping');
      this.onAdComplete?.();
      return;
    }

    this.onAdLoaded?.();
  };

  /**
   * Handle ad started event
   */
  private handleAdStarted = (): void => {
    console.log('Ad STARTED event fired - video is now playing!');
    this.onAdStarted?.();
  };

  /**
   * Handle ad complete event
   */
  private handleAdComplete = (): void => {
    console.log('Ad COMPLETE/SKIPPED event fired');
    this.onAdComplete?.();
  };

  /**
   * Handle ad error event
   */
  private handleAdError = (event: google.ima.AdErrorEvent): void => {
    const error = event.getError();
    if (!error) {
      console.error('Ad error event with no error object');
      this.onAdError?.('Unknown ad error');
      return;
    }
    
    const errorMessage = `Ad error - ${error.getErrorCode()}: ${error.getMessage()}`;
    console.error(errorMessage);
    console.error('Error details:', error);
    
    if (this.adsManager) {
      try {
        this.adsManager.destroy();
      } catch (e) {
        console.error('Error destroying adsManager after error:', e);
      }
      this.adsManager = null;
    }
    
    this.onAdError?.(errorMessage);
  };
}
