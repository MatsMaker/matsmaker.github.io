import { GameModel } from './gameModel/GameModel';

export class GameView {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scoreEl: HTMLElement | null;
  cell: number;
  cols: number;
  rows: number;

  constructor(
    canvas: HTMLCanvasElement,
    scoreEl: HTMLElement | null,
    cell: number,
    cols: number,
    rows: number
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;
    this.scoreEl = scoreEl;
    this.cell = cell;
    this.cols = cols;
    this.rows = rows;
  }

  render(model: GameModel): void {
    const ctx = this.ctx;
    if (!model || !model.snake || !model.food) {
      return;
    }
    if (this.scoreEl) {
      this.scoreEl.textContent = `Score: ${model.score}`;
    }
    const s = model.snake.segments;
    const f = model.food;
    
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= this.cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.cell + 0.5, 0);
      ctx.lineTo(i * this.cell + 0.5, this.rows * this.cell);
      ctx.stroke();
    }
    for (let i = 0; i <= this.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.cell + 0.5);
      ctx.lineTo(this.cols * this.cell, i * this.cell + 0.5);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#c94c4c';
    ctx.fillRect(f.x * this.cell + 1, f.y * this.cell + 1, this.cell - 2, this.cell - 2);
    
    s.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#6ecf6e' : '#4a9f4a';
      ctx.fillRect(seg.x * this.cell + 1, seg.y * this.cell + 1, this.cell - 2, this.cell - 2);
    });
    
    if (!model.running) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Game over — press Backspace for start screen',
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
  }
}
