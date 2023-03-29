import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData, docData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { doc } from "firebase/firestore";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  private firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  gameDb = collection(this.firestore, 'games');
  currentCard: string = '';
  hasPickCardAnimation = false;
  constructor(private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      // console.log('ngOnInit(): ' + this.gameDb.id);
      console.log('ngOnInit(): ' + params['id']);
      const docRef = doc(collection(this.firestore, 'games'), params['id']);
      docData(docRef).subscribe((doc) => {
        console.log('ngOnInit(): ' + doc);
      });
    })
    this.startGame();
  }


  async startGame() {
    this.game = new Game();
    // await addDoc(this.gameDb, { gameJson: this.game.toJson() });
    this.games$ = collectionData(this.gameDb);
    this.games$.subscribe((games) => {
      console.log('startGame(): ' + games)
    })
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
      if (name && name.length > 0) { this.game.players.push(name); }
    });
  }

}