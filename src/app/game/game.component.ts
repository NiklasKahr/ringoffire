import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  private firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  docRef: any;
  docId: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.startGame();
      this.docId = params['id'];
      this.docRef = doc(collection(this.firestore, 'games'), this.docId);
      docData(this.docRef, { idField: 'id' }).subscribe((doc: any) => {
        this.game.currentPlayer = doc.currentPlayer;
        this.game.placedCards = doc.placedCards ?? [];
        this.game.players = doc.players;
        this.game.stack = doc.stack;
        this.game.currentCard = doc.currentCard;
        this.game.hasPickCardAnimation = doc.hasPickCardAnimation;
      });
    })
  }


  startGame() {
    this.game = new Game();
  }


  pickCard() {
    if (!this.game.hasPickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.game.hasPickCardAnimation = true;
      console.log('currentCard: ' + this.game.currentCard);
      console.log('game.placedCards: ' + this.game.placedCards);
      //players take turns
      this.game.currentPlayer = (++this.game.currentPlayer) % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.placedCards.push(this.game.currentCard);
        this.game.hasPickCardAnimation = false;
        this.saveGame();
      }, 1250);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }


  async saveGame() {
    console.log(this.game.toJson());
    await updateDoc(this.docRef, this.game.toJson());
  }
}