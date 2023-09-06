import { Component, HostListener } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Item } from '../../models/Item';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  title = '2048';
  size = Array(this.gameService.size);
  SIZE_SQUARE = 106;
  BORDER_BETWEEN_SQUARE = 16;
  BORDER_TOP = 0;

  constructor(public gameService: GameService) {}

  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowLeft':
        this.gameService.left();
        break;
      case 'ArrowRight':
        this.gameService.right();
        break;
      case 'ArrowUp':
        this.gameService.up();
        break;
      case 'ArrowDown':
        this.gameService.down();
        break;

      default:
        break;
    }
  }
}
