import { Point } from './Point';

export class Snake {
  segments: Point[];
  dirX: number;
  dirY: number;
  pendingDirX: number;
  pendingDirY: number;
  growPending: number;

  constructor(startX: number, startY: number, length: number) {
    this.segments = [];
    for (let i = 0; i < length; i++) {
      this.segments.push(new Point(startX - i, startY));
    }
    this.dirX = 1;
    this.dirY = 0;
    this.pendingDirX = 1;
    this.pendingDirY = 0;
    this.growPending = 0;
  }

  queueDirection(dx: number, dy: number): void {
    if (this.dirX + dx === 0 && this.dirY + dy === 0) {
      return;
    }
    this.pendingDirX = dx;
    this.pendingDirY = dy;
  }

  step(): void {
    this.dirX = this.pendingDirX;
    this.dirY = this.pendingDirY;
    const head = this.segments[0];
    const newHead = new Point(head.x + this.dirX, head.y + this.dirY);
    this.segments.unshift(newHead);
    if (this.growPending > 0) {
      this.growPending -= 1;
    } else {
      this.segments.pop();
    }
  }

  head(): Point {
    return this.segments[0];
  }

  grow(n: number = 1): void {
    this.growPending += n;
  }

  hitsSelf(): boolean {
    const h = this.head();
    for (let i = 1; i < this.segments.length; i++) {
      if (h.equals(this.segments[i])) {
        return true;
      }
    }
    return false;
  }
}
