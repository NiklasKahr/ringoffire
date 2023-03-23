import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  hasPickCardAnimation = false;
  currentCard: string = '';
  game!: Game; // !:

  constructor(public dialog: MatDialog) { }


  ngOnInit() {
    this.startGame();
  }


  startGame() {
    this.game = new Game();
  }


  pickCard() {
    if (!this.hasPickCardAnimation) {
      this.currentCard = this.game.stack.pop()!; // ! is a non-null assertion operator
      this.hasPickCardAnimation = true;
      //currentPlayer takes turns (modulo)
      this.game.currentPlayer = (++this.game.currentPlayer) % this.game.players.length;
      setTimeout(() => {
        this.game.placedCards.push(this.currentCard);
        this.hasPickCardAnimation = false;
      }, 1250);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) { this.game.players.push(name); }
    });
  }

}