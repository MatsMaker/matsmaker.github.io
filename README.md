# Snake Game

A classic Snake game built with **TypeScript**, featuring Google IMA video ads integration, TV platform support, and bundled with Webpack. Clean MVC architecture with modular design and strict typing.

## Features

- 🎮 Classic snake gameplay with arrow key controls
- 📊 Real-time score tracking
- 💥 Game over detection (wall collision and self-collision)
- 🎬 Google IMA SDK video ad integration (plays before game start)
- 📺 **TV Platform Support**: LG webOS, Samsung Tizen, and generic Smart TV remotes
- 🎨 Responsive canvas-based rendering with grid display
- 🏗️ **Clean MVC Architecture** with modular ad system
- ⚡ TypeScript with strict type checking
- 🛡️ Error handling and memory leak prevention
- 🎯 Centralized configuration system

## Installation

Install the dependencies:

```bash
npm install
```

## Usage

### Development Mode

Run webpack in watch mode (auto-rebuilds on file changes):

```bash
npm run dev
```

### Development Server

Start webpack dev server with hot reload at http://localhost:8080:

```bash
npm start
```

### Production Build

Build optimized production files to the `dist/` folder:

```bash
npm run build
```

The compiled game will be in the `dist/` directory, ready to deploy.

## How to Play

1. Click **"Yes, start"** on the welcome screen
2. Watch the video ad (or skip ads with `?nosnakeads=1` in the URL for local testing)
3. Control the snake:
   - **Arrow Keys** (⬅️ ➡️ ⬆️ ⬇️) on desktop/laptop
   - **TV Remote** arrow buttons on Smart TVs
   - **Color buttons** (Red/Green/Yellow/Blue) on LG webOS remotes
4. Eat **red squares** to grow and score points
5. Avoid hitting walls and yourself
6. After game over, press **Backspace** or **TV Back** button to return to the start screen

### Keyboard Controls

| Action | Keys |
|--------|------|
| Move Left | ← Arrow, Left |
| Move Right | → Arrow, Right |
| Move Up | ↑ts                      # Application entry point
│   ├── Application.ts               # Main app facade with lifecycle management
│   ├── config.ts                    # Centralized configuration constants
│   ├── GameController.ts            # Input handling, game loop, TV remote support
│   ├── GameView.ts                  # Canvas rendering engine
│   ├── UIController.ts              # UI state management
│   ├── UIView.tsx                   # JSX UI components (without React)
│   ├── AdsManager.ts                # Ads system facade
│   ├── styles.scss                  # Game styles (SASS)
│   ├── index.html                   # HTML template
│   ├── GameModel/
│   │   ├── GameModel.ts             # Core game logic and state
│   │   ├── Snake.ts                 # Snake entity with movement
│   │   └── Point.ts                 # 2D point utility
│   ├── ads/                         # Modular ad system
│   │   ├── AdConfig.ts              # Ad system configuration
│   │   ├── AdFlowController.ts      # Ad flow and UI transitions
│   │   ├── IMAAdPlayer.ts           # Google IMA SDK integration
│   │   └── index.ts                 # Ads module exports
│   └── types/
│       └── styles.d.ts              # CSS/SCSS type declarations
├── static/
│   ├── reset.css                    # CSS reset
│   ├── ad-test.html                 # Ad integration test page
│   └── arrow-key-test.html          # Keyboard input test page
├── dist/                            # Build output (generated)
├── tsconfig.json                    # TypeScript configuration
├── webpack.config.js                # Webpack bundler configuration
├── eslint.config.js                 # ESLint rules
└── package.json                     # Dependencies and npm
├── src/
│   ├── main.js          # Entry point
│   ├── game.js          # Game facade and UI flow
│   ├── model.js         # Game logic (Snake, GameModel)
│   ├── view.js          # Canvas rendering
│   TypeScript 6** - Type-safe game logic with strict mode
- **HTML5 Canvas** - Hardware-accelerated game rendering
- **SASS/SCSS** - Advanced styling with variables and mixins
- **Webpack 5** - Module bundling and optimization
- **Google IMA SDK** - Video ad integration with official types
- **ESLint** - Code quality and consistency
- **Custom JSX** - UI components without React framework

## Architecture

### MVC Pattern

- **Model** (`GameModel/`) - Game state, Snake logic, collision detection
- **View** (`GameView`, `UIView`) - Canvas rendering and UI components
- **Controller** (`GameController`, `UIController`) - Input handling and flow control

### Modular Ad System

The ad system is split into focused modules:

- **`AdConfig`** - Configuration constants
- *Configuration

Game settings are centralized in `src/config.ts`:

```typescript
export const GAME_CONFIG = {
  CELL_SIZE: 20,           // Cell size in pixels
  GRID_COLS: 20,           // Grid columns
  GRID_ROWS: 20,           // Grid rows
  STEP_MS: 600,            // Game speed (ms per step)
  INITIAL_SNAKE_LENGTH: 3, // Starting snake length
} as const;
```

TV remote key mappings and ad configuration are also defined in config files.

## Development Notes

### TypeScript Features

- **Strict mode** enabled for maximum type safety
- **Official Google IMA types** via `@types/google_interactive_media_ads_types`
- **Path aliases** for cleaner imports (`@static/*`)
- **Source maps** for debugging

### Memory Management

The `GameController` includes a `destroy()` method that:
- Removes all event listeners
- Stops the game loop
- Prevents memory leaks on page navigation

### TV Platform Support

Extensive key code mapping for:
- **LG webOS** (keyboardHook API, PalmSystem)
- **Samsung Tizen** (standard key events)
- **Generic Smart TV remotes** (various key codes)
- **Mouse events** for remotes that send button presses as mouse events

### Ad System

- Bypasses ads in development: `?nosnakeads=1`
- Safety timeout (8s) prevents infinite waiting
- Graceful fallback if IMA SDK fails to load
- Proper error handling and user feedback

## Browser Compatibility

- Modern browsers with ES2020 support
- HTML5 Canvas support required
- HTTPS required for Google IMA SDK
- Smart TV browsers (LG webOS 3.0+, Tizen 2.4+)

## Testing

Test pages are available in `static/`:

- `ad-test.html` - Test Google IMA ad integration
- `arrow-key-test.html` - Test keyboard/remote input

## License

ISC

## Contributing

Contributions are welcome! Please ensure:

1. TypeScript compiles without errors (`npm run build`)
2. ESLint passes (no errors, warnings acceptable for console statements)
3. Code follows existing patterns and architecture
4. Add appropriate type definitions for new features

- **Bundle size**: ~26 KiB (minified)
- **Build time**: ~1.8 seconds
- **Performance limit**: 300 KB (enforced by webpack)

## Code Quality

- ✅ **0 TypeScript errors** - Full type coverage
- ✅ **0 ESLint errors** - Clean code standards
- ✅ **Strict null checks** - No unsafe operations
- ✅ **Memory leak prevention** - Proper cleanup methods
- ✅ **Error boundaries** - Graceful error handling
│   ├── styles.css       # Game styles
│   ├── favicon.ico      # Favicon
│   └── .htaccess        # Apache config
├── dist/                # Build output (generated)
├── webpack.config.js    # Webpack configuration
└── package.json         # Dependencies and scripts
```

## Technologies

- **JavaScript (ES6 modules)** - Game logic
- **HTML5 Canvas** - Game rendering
- **CSS3** - Styling
- **Webpack 5** - Module bundling
- **Google IMA SDK** - Video ad integration

## Development Notes

- The game uses an MVC pattern to separate concerns
- Webpack bundles all JavaScript modules into a single `bundle.js`
- CSS is injected into the page via style-loader
- Static assets (CSS, favicon, .htaccess) are copied to `dist/` during build
- Ad integration can be bypassed in development with `?nosnakeads=1` query parameter

## License

ISC
