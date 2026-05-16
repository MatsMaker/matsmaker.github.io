/**
 * Google IMA SDK for video ads.
 * Runs after the player taps "Yes, start" on the welcome screen.
 * Using Google's test video ad tag for development/testing.
 * Docs: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side
 * Test Tags: https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/tags
 *
 * Append ?nosnakeads=1 to the page URL to skip ads (local testing only).
 *
 * REFACTORED: Now uses modular architecture with AdFlowController and IMAAdPlayer
 */

import { AdFlowController } from './AdFlowController';

/**
 * Simplified AdsManager facade
 * Delegates to AdFlowController for all ad-related functionality
 */
export class AdsManager {
  private adFlowController: AdFlowController;

  constructor() {
    this.adFlowController = new AdFlowController();
  }

  /**
   * Start the ad flow, returning a Promise that resolves when ready to start game.
   */
  public runAdsThenStartGame(): Promise<void> {
    return this.adFlowController.runAdFlow();
  }

  /**
   * Clean up and reset all ad state.
   */
  public resetAdsFlow(): void {
    this.adFlowController.reset();
  }
}
