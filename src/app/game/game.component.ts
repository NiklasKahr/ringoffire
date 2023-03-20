import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game | undefined; //game: Game;

  constructor() { }

  ngOnInit() {
    this.startGame();
  }

  pickCard() {
    this.pickCardAnimation = true;
  }

  startGame() {
    this.game = new Game();
    console.log(this.game);
  }

}
