import { Point } from './Point';
import { Snake } from './Snake';

export class GameModel {
  cols: number;
  rows: number;
  snake: Snake | null;
  food: Point | null;
  score: number;
  running: boolean;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.running = false;
  }

  randomEmptyCell(): Point {
    if (!this.snake) {
      return new Point(0, 0);
    }
    
    for (let tries = 0; tries < 500; tries++) {
      const x = Math.floor(Math.random() * this.cols);
      const y = Math.floor(Math.random() * this.rows);
      const occupied = this.snake.segments.some(seg => seg.x === x && seg.y === y);
      if (!occupied) {
        return new Point(x, y);
      }
    }
    return new Point(0, 0);
  }

  clear(): void {
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.running = false;
  }

  reset(): void {
    this.snake = new Snake(
      Math.floor(this.cols / 2),
      Math.floor(this.rows / 2),
      3
    );
    this.food = this.randomEmptyCell();
    this.score = 0;
    this.running = true;
  }

  queueDirection(dx: number, dy: number): void {
    if (this.snake) {
      this.snake.queueDirection(dx, dy);
    }
  }

  step(): void {
    if (!this.running || !this.snake) {
      return;
    }
    this.snake.step();
    const head = this.snake.head();
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      this.running = false;
      return;
    }
    if (this.snake.hitsSelf()) {
      this.running = false;
      return;
    }
    if (this.food && head.equals(this.food)) {
      this.snake.grow(1);
      this.score += 1;
      this.food = this.randomEmptyCell();
    }
  }
}
