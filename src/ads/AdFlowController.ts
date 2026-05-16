import { AD_CONFIG } from './AdConfig';
import { IMAAdPlayer } from './IMAAdPlayer';

/**
 * Controls the ad flow and manages UI transitions
 */
export class AdFlowController {
  private adPlayer: IMAAdPlayer;
  private safetyTimerId: number | null = null;
  private revealTimeoutId: number | null = null;
  private revealScheduled = false;
  private adsBusy = false;
  private adPlaying = false;
  private gameStartResolve: (() => void) | null = null;

  constructor() {
    this.adPlayer = new IMAAdPlayer();
    this.setupAdPlayerCallbacks();
  }

  /**
   * Start the ad flow and return a Promise that resolves when ready to start game
   */
  runAdFlow(): Promise<void> {
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
   * Reset the ad flow state
   */
  reset(): void {
    this.adsBusy = false;
    this.revealScheduled = false;
    this.adPlaying = false;
    this.clearTimers();
    
    if (this.gameStartResolve) {
      this.gameStartResolve = null;
    }
    
    this.adPlayer.destroy();
  }

  /**
   * Check if ads should be skipped (dev mode)
   */
  private shouldSkipAds(): boolean {
    return window.location?.search?.includes('nosnakeads=1') ?? false;
  }

  /**
   * Start the ad flow
   */
  private startAdFlow(): void {
    if (this.shouldSkipAds()) {
      console.log('Snake Ads: Skipping ads (dev mode)');
      this.setStatus('Ads skipped (dev).');
      this.scheduleReveal(0);
      return;
    }

    if (!window.google?.ima) {
      console.error('Snake Ads: IMA SDK not loaded - check HTTPS, ad blockers, or network');
      this.setStatus('IMA SDK not loaded — starting game.');
      this.scheduleReveal(AD_CONFIG.MIN_VIEW_MS_EMPTY);
      return;
    }

    console.log('Snake Ads: Starting ad request...');
    this.setStatus('Loading video ad…');
    this.runVideoAd();
  }

  /**
   * Run the video ad
   */
  private runVideoAd(): void {
    this.clearTimers();
    this.revealScheduled = false;
    this.adPlaying = false;

    this.startSafetyTimeout();

    const success = this.adPlayer.requestAds();
    if (!success) {
      console.error('Failed to request ads');
      this.scheduleReveal(AD_CONFIG.MIN_VIEW_MS_EMPTY);
    }
  }

  /**
   * Setup callbacks for ad player events
   */
  private setupAdPlayerCallbacks(): void {
    this.adPlayer.onAdLoaded = () => {
      // Ad loaded, waiting for start
    };

    this.adPlayer.onAdStarted = () => {
      this.adPlaying = true;
      this.setStatus('Playing ad — game will start after...');
    };

    this.adPlayer.onAdComplete = () => {
      this.setStatus('Thanks for watching!');
      this.scheduleReveal(AD_CONFIG.MIN_VIEW_MS_WITH_CREATIVE);
    };

    this.adPlayer.onAdError = () => {
      this.setStatus('Ad could not be loaded — starting the game shortly.');
      this.scheduleReveal(AD_CONFIG.MIN_VIEW_MS_EMPTY);
    };
  }

  /**
   * Schedule game reveal after delay
   */
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

  /**
   * Reveal the game and hide ad UI
   */
  private revealGame(): void {
    this.clearTimers();
    this.hideAdUI();
    this.showGameUI();
    this.resolveGameStart();
    this.adsBusy = false;
    this.revealScheduled = false;
  }

  /**
   * Start safety timeout to prevent infinite waiting
   */
  private startSafetyTimeout(): void {
    this.safetyTimerId = window.setTimeout(() => {
      this.safetyTimerId = null;
      
      if (!this.adPlaying) {
        console.warn(
          `Snake Ads: Timeout (${AD_CONFIG.AD_REQUEST_TIMEOUT_MS / 1000}s) - no ad response from Google`
        );
        console.warn('Snake Ads: This is normal - test ad tags don\'t always have available ads');
        this.setStatus('No ad available — starting the game.');
        this.scheduleReveal(0);
      }
    }, AD_CONFIG.AD_REQUEST_TIMEOUT_MS);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    this.clearSafetyTimer();
    this.cancelRevealTimer();
  }

  /**
   * Clear safety timeout
   */
  private clearSafetyTimer(): void {
    if (this.safetyTimerId !== null) {
      window.clearTimeout(this.safetyTimerId);
      this.safetyTimerId = null;
    }
  }

  /**
   * Cancel reveal timer
   */
  private cancelRevealTimer(): void {
    if (this.revealTimeoutId !== null) {
      window.clearTimeout(this.revealTimeoutId);
      this.revealTimeoutId = null;
    }
  }

  /**
   * Hide ad UI elements
   */
  private hideAdUI(): void {
    const uiRoot = document.getElementById(AD_CONFIG.DOM_IDS.UI_ROOT);
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
  }

  /**
   * Show game UI elements
   */
  private showGameUI(): void {
    const gameRoot = document.getElementById(AD_CONFIG.DOM_IDS.GAME_ROOT);
    if (gameRoot) {
      gameRoot.style.display = 'block';
    }
  }

  /**
   * Resolve the game start promise
   */
  private resolveGameStart(): void {
    if (this.gameStartResolve) {
      this.gameStartResolve();
      this.gameStartResolve = null;
    }
  }

  /**
   * Set status text in UI
   */
  private setStatus(text: string): void {
    const el = document.getElementById(AD_CONFIG.DOM_IDS.AD_STATUS);
    if (el) {
      el.textContent = text;
    }
  }
}
