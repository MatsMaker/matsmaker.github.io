/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  /** Cell size in pixels */
  CELL_SIZE: 20,
  /** Number of columns in the grid */
  GRID_COLS: 20,
  /** Number of rows in the grid */
  GRID_ROWS: 20,
  /** Step interval in milliseconds */
  STEP_MS: 600,
  /** Initial snake length */
  INITIAL_SNAKE_LENGTH: 3,
} as const;

/**
 * DOM element IDs
 */
export const DOM_IDS = {
  CANVAS: 'board',
  SCORE: 'score',
  START_BUTTON: 'btn-start-game',
  GAME_ROOT: 'game-root',
  UI_ROOT: 'ui-root',
} as const;

/**
 * TV platform key mappings for remote controls
 */
export const TV_KEY_MAPPINGS = {
  /** Arrow keys for all platforms */
  ARROW_KEYS: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],
  
  /** Generic TV platform keys */
  GENERIC_TV: ['Left', 'Right', 'Up', 'Down'],
  
  /** LG webOS specific keys */
  LG_WEBOS: ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'],
  
  /** Media control keys */
  MEDIA_KEYS: ['MediaRewind', 'MediaFastForward'],
  
  /** Back/Exit keys */
  BACK_KEYS: ['Backspace', 'Back', 'XF86Back'],
  
  /** LG webOS key codes */
  LG_KEY_CODES: {
    LEFT: [37, 21, 4, 403] as readonly number[],
    UP: [38, 19, 0, 404] as readonly number[],
    RIGHT: [39, 22, 5, 405] as readonly number[],
    DOWN: [40, 20, 1, 406] as readonly number[],
    BACK: [8, 461, 10009, 27] as readonly number[],
  },
  
  /** Mouse button mappings for TV remotes */
  MOUSE_BUTTONS: {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
  },
} as const;

/**
 * Keys to register for LG webOS platform
 */
export const LG_WEBOS_REGISTER_KEYS = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Left',
  'Right',
  'Up',
  'Down',
  'ColorF0Red',
  'ColorF1Green',
  'ColorF2Yellow',
  'ColorF3Blue',
  'Back',
  'Enter',
] as const;
