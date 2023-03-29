import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
  // firebaseConfig = {
  //   apiKey: "AIzaSyDFp0KPMTb0JhBfroWnGRIGUSI86tJyZyo",
  //   authDomain: "ring-of-fire-e2f80.firebaseapp.com",
  //   projectId: "ring-of-fire-e2f80",
  //   storageBucket: "ring-of-fire-e2f80.appspot.com",
  //   messagingSenderId: "89660740149",
  //   appId: "1:89660740149:web:dd556651938446989e977c"
  // };
  // // Initialize Firebase
  // app = initializeApp(this.firebaseConfig);
  // // Initialize Cloud Firestore and get a reference to the service
  // db = getFirestore(this.app);
  constructor(private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      console.log('ngOnInit(): ' + params['id']);
      // this.games$.doc(params['id']);
      //this.router.navigateByUrl('/game/' + params['id']);
      const docRef = doc(collection(this.firestore, 'games'), this.gameDb.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("ngOnInit(): Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("ngOnInit(): No such document!");
      }
    })
    this.startGame();
  }


  async startGame() {
    this.game = new Game();
    // const gameDb = collection(this.firestore, 'games');
    // await addDoc(gameDb, { gameJson: this.game.toJson() });
    console.log('startGame(): ' + this.gameDb.id);
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