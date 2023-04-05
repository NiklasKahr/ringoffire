export class Game {
    public players: string[] = [];
    public images: string[] = [];
    public stack: string[] = [];
    public placedCards: string[] = [];
    public currentPlayer: number = 0;
    public currentCard: string = '';
    public hasPickCardAnimation = false;
    constructor() {
        for (let i = 1; i < 14; i++) {
            this.stack.push(`spade_${i}`);
            this.stack.push(`hearts_${i}`);
            this.stack.push(`clubs_${i}`);
            this.stack.push(`diamonds_${i}`);
        }
        shuffle(this.stack);
    }


    public toJson() {
        return {
            players: this.players,
            images: this.images,
            stack: this.stack,
            placedCards: this.placedCards,
            currentPlayer: this.currentPlayer,
            currentCard: this.currentCard,
            hasPickCardAnimation: this.hasPickCardAnimation
        }
    }
}


function shuffle(array: string[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};