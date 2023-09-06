import { Injectable } from '@angular/core';
import { Item } from '../models/Item';

type cellDirection = 'col' | 'row';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  size = 4;
  cells: number[] = [];
  scores = 0;
  bestScore = 0;
  theEnd = false;
  items: Item[] = [];

  private get emptyCells(): number[] {
    const notEmptyCells = this.notEmptyCells;
    return this.cells.filter((position) => !notEmptyCells.includes(position));
  }

  private get notEmptyCells(): number[] {
    return this.items.map((item) => item.row * 10 + item.col);
  }

  constructor() {
    this.createCells();
    this.generateItems();
  }

  resetGame() {
    this.scores = 0;
    this.items = [];
    this.theEnd = false;
    this.generateItems();
  }

  left() {
    this.move('col', false);
  }

  right() {
    this.move('col', true);
  }

  down() {
    this.move('row', true);
  }

  up() {
    this.move('row', false);
  }

  private move(direction: cellDirection, forward: boolean) {
    if (this.theEnd) return;
    this.clearDeletedItems();

    let isMove = false;
    for (let indexRowOrCol = 0; indexRowOrCol < this.size; indexRowOrCol++) {
      const items: Item[] = this.getCurrentDirectionItems(direction, forward, indexRowOrCol);
      let currentFreeCell = forward ? this.size - 1 : 0;
      const addDirection = forward ? -1 : 1;

      let prevItem: Item | null = null;

      for (let i = 0; i < items.length; i++) {
        const currentItem = items[i];
        if (prevItem && this.canMerge(prevItem, currentItem)) {
          this.merge(prevItem, currentItem);
          this.scores += currentItem.value;
          currentFreeCell += -addDirection;
        }
        if (this.moveItem(currentItem, direction, currentFreeCell)) isMove = true;
        prevItem = currentItem;
        currentFreeCell += addDirection;
      }
    }

    if (!isMove) return;

    this.bestScore = Math.max(this.scores, this.bestScore);
    this.generateItems();
    this.theEnd = this.thisIsTheEnd();
  }

  private moveItem(item: Item, direction: cellDirection, cell: number) {
    const canMove = item[direction] !== cell;
    item[direction] = cell;
    return canMove;
  }

  private merge(prevItem: Item, currentItem: Item) {
    prevItem.isDeleted = true;
    currentItem.value *= 2;
  }

  private canMerge(a: Item, b: Item) {
    return a.value === b.value;
  }

  private canIMove() {
    if (!this.isFullItems()) return true;
    return this.canIMoveDirection('col') || this.canIMoveDirection('row');
  }

  private canIMoveDirection(col: cellDirection, forward = true, skipDir = true) {
    for (let indexRowOrCol = 0; indexRowOrCol < this.size; indexRowOrCol++) {
      const items = this.getCurrentDirectionItems(col, forward, indexRowOrCol);
      const length = items.length;
      if (this.hasMerge(items)) return true;
      if (this.isFullRowOrCol(length)) continue;
      if (skipDir) return true;

      const start = forward ? this.size - length : 0;
      const end = forward ? this.size - 1 : length - 1;
      if (items.find((item) => !(start <= item[col] && item[col] <= end))) return true;
    }

    return false;
  }

  private hasMerge(items: Item[]) {
    for (let i = 1; i < items.length; i++) if (items[i - 1].value === items[i].value) return true;
    return false;
  }

  private isFullItems() {
    return this.items.length === this.size * this.size;
  }

  private isFullRowOrCol(length: number) {
    return length === this.size;
  }

  private getCurrentDirectionItems(direction: cellDirection, forward: boolean, indexRowOrCol: number) {
    const row = direction === 'col' ? 'row' : 'col';
    return this.items
      .filter((item) => !item.isDeleted && item[row] === indexRowOrCol)
      .sort((a, b) => (forward ? b[direction] - a[direction] : a[direction] - b[direction]));
  }

  private clearDeletedItems() {
    this.items = this.items.filter((i) => !i.isDeleted);
  }

  private generateItems() {
    const newItems = this.emptyCells
      .sort(() => Math.random() - 0.5)
      .slice(0, 1)
      .map<Item>((position) => ({ value: 2, col: position % 10, row: (position - (position % 10)) / 10, isDeleted: false, isNew: true, isMerged: false }));

    this.items = [...this.items, ...newItems];
  }

  private thisIsTheEnd() {
    return !this.canIMove();
  }

  private createCells() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.cells.push(row * 10 + col);
      }
    }
  }
}
