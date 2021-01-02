import Player from './Player';

export default class Match {
    constructor(private player1: Player, private player2: Player, private score: MatchResult) {}

    public opponentFor(player: Player): Player {
        if (this.player1 == player) {
            return this.player2;
        }

        return this.player1;
    }

    public resultFor(player: Player): MatchResult {
        if (this.player1 == player) {
            return this.score;
        }

        return 1 - this.score;
    }
}


export enum MatchResult {
    WIN = 1.0,
    DRAW = 0.5,
    LOSS = 0.0
}