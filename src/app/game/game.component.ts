import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { doc } from "firebase/firestore";
//import update
import { updateDoc } from "firebase/firestore";
import { getDatabase, ref, child, push, update } from "firebase/database";
import { Database } from '@angular/fire/database';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  private firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  currentCard: string = '';
  hasPickCardAnimation = false;
  docRef: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('ngOnInit(): ' + params['id']);
      this.docRef = doc(collection(this.firestore, 'games'), params['id']);
      docData(this.docRef).subscribe((doc: any) => {
        console.log('doc: ' + doc);
        console.log('doc[\'gameJson\']: ' + doc['gameJson']);
        const currentPlayer = doc['gameJson'].currentPlayer;
        const placedCards = doc['gameJson'].placedCards;
        console.log('currentPlayer: ' + currentPlayer);
        console.log('placedCards: ' + placedCards);
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


  saveGame() {
    const db = getDatabase();
    // let ref = Database.database("https://db.europe-west1.firebasedatabase.app")
    debugger;
    console.log(db);
    console.log(this.game.toJson());
    update(ref(db), this.game.toJson());
    // this.ref('games').update(this.game.toJson(), 'games');
  }
}