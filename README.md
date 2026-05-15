# Snake Game

A classic Snake game built with vanilla JavaScript, featuring Google IMA video ads integration and bundled with Webpack.

## Features

- Classic snake gameplay with arrow key controls
- Score tracking
- Game over detection (wall collision and self-collision)
- Welcome screen with help instructions
- Google IMA SDK video ad integration (plays before game start)
- Responsive canvas-based rendering
- MVC architecture (Model-View-Controller)

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

1. Click "Yes, start" on the welcome screen
2. Watch the video ad (or skip it with `?nosnakeads=1` in the URL)
3. Use **Arrow Keys** to control the snake:
   - ← Left
   - → Right  
   - ↑ Up
   - ↓ Down
4. Eat red squares to grow and score points
5. Avoid hitting walls and yourself
6. After game over, press **Backspace** to return to the start screen

## Project Structure

```
snake-game/
├── src/
│   ├── main.js          # Entry point
│   ├── game.js          # Game facade and UI flow
│   ├── model.js         # Game logic (Snake, GameModel)
│   ├── view.js          # Canvas rendering
│   ├── controller.js    # Input handling and game loop
│   ├── ads.js           # Google IMA ads integration
│   └── index.html       # HTML template
├── static/
│   ├── reset.css        # CSS reset
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
