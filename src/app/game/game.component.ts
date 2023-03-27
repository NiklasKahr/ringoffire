import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  hasPickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  private firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  
  constructor(public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
    console.log(this.items$);
  }


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