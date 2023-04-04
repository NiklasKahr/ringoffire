import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, docData, getFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, updateDoc } from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  private firestore: Firestore = inject(Firestore);
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  games$: Observable<any[]>;
  currentCard: string = '';
  hasPickCardAnimation = false;
  docRef: any;
  docID: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('ID of Document: ' + params['id']);
      this.docRef = doc(collection(this.firestore, 'games'), params['id']);
      this.docID = params['id'];
      docData(this.docRef).subscribe((doc: any) => {
        console.log('doc: ' + doc);
        console.log('doc[\'gameJson\']: ' + doc['gameJson']);
        const currentPlayer = doc['gameJson'].currentPlayer;
        const placedCards = doc['gameJson'].placedCards;
        // console.log('currentPlayer: ' + currentPlayer);
        // console.log('placedCards: ' + placedCards);
        this.game.currentPlayer = doc['gameJson'].currentPlayer;
        this.game.placedCards = doc['gameJson'].playedCards ?? [];
        this.game.players = doc['gameJson'].players;
        this.game.stack = doc['gameJson'].stack;
      });
    })
    this.startGame();
  }


  async startGame() {
    this.game = new Game();
  }


  pickCard() {
    if (!this.hasPickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      this.hasPickCardAnimation = true;
      //players take turns
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
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }


  async saveGame() {
    // const db = getDatabase();
    // console.log(db);
    // console.log(ref);
    console.log(this.game.toJson());

    await updateDoc(this.docRef, { gameJson: this.game.toJson() });
    // --> this.docRef = doc(collection(this.firestore, 'games'), params['id'])
    // however, according to Firebase Docs:
    // docRef = doc(db, 'games', this.docID) - throws error (docID = params['id'])
  }
}