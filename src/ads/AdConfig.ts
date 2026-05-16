/**
 * Configuration constants for the ads system
 */
export const AD_CONFIG = {
  /** Google test video ad tag URL */
  VIDEO_AD_TAG: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  
  /** Minimum time to show UI with creative ad (ms) */
  MIN_VIEW_MS_WITH_CREATIVE: 1000,
  
  /** Minimum time to show UI when no ad available (ms) */
  MIN_VIEW_MS_EMPTY: 900,
  
  /** Timeout for ad request from Google (ms) */
  AD_REQUEST_TIMEOUT_MS: 8000,
  
  /** Ad container dimensions */
  AD_DIMENSIONS: {
    WIDTH: 640,
    HEIGHT: 480,
  },
  
  /** Non-linear ad dimensions */
  NON_LINEAR_AD_DIMENSIONS: {
    WIDTH: 640,
    HEIGHT: 150,
  },
  
  /** DOM element IDs */
  DOM_IDS: {
    AD_VIDEO: 'ad-video',
    AD_CONTAINER: 'ad-container',
    AD_STATUS: 'ad-status',
    UI_ROOT: 'ui-root',
    GAME_ROOT: 'game-root',
  },
} as const;
