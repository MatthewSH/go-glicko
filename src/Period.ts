import Match, { MatchResult } from './Match';
import MathUtils from './MathUtils';
import Player from './Player';

export default class Period
{
    private players: Player[] = [];

    constructor(private tau: number = 0.5) {}

    public addPlayer(player: Player) {
        this.players.forEach((p: Player) => {
            if (p == player) {
                return;
            }
        });

        this.players.push(player);
    }

    public addMatch(player1: Player, player2: Player, score: MatchResult) {
        this.addPlayer(player1);
        this.addPlayer(player2);

        let match: Match = new Match(player1, player2, score);

        player1.addMatch(match);
        player2.addMatch(match);
    }

    public Calculate() {
        this.players.forEach((player: Player) => {
            if (player.matches.length > 0) {
                let v: number = this.v(player);
                let dp: number = this.delta(player);
                let delta: number = v * dp;
                let sigmaP: number = MathUtils.sigmaP(delta, player.pre.sigma, player.pre.phi, v, this.tau);
                let phiS: number = MathUtils.phiA(player.pre.phi, sigmaP);
                let phiP: number = MathUtils.phiP(phiS, v);
                let muP: number = MathUtils.muP(player.pre.mu, phiP, dp);

                player.post.Update(muP, phiP, sigmaP);
            } else {
                player.post.Touch();
            }
        });
    }

    public v(player: Player): number {
        let v: number = 0.0;

        player.matches.forEach((match: Match) => {
            let opponent: Player = match.opponentFor(player);

            let g: number = this.g(opponent.pre.phi);
            let E: number = this.e(player.pre.mu, opponent.pre.mu, opponent.pre.phi);
            let vj: number = g * g * E * (1 - E);
            
            v += vj;
        });

        return 1 / v;
    }

    public g(phiJ: number): number {
        return 1 / Math.sqrt(1 + 3 * Math.pow(phiJ, 2) / Math.pow(Math.PI, 2));
    }

    public e(mu: number, muJ: number, phiJ: number): number {
        return 1 / (1 + Math.exp(-this.g(phiJ) * (mu - muJ)));
    }

    public delta(player: Player): number {
        let outcomeBasedRating: number = 0.0;

        player.matches.forEach((match: Match) => {
            let opponent: Player = match.opponentFor(player);
            let oPhi: number = this.g(opponent.pre.phi);
            let sc: number = match.resultFor(player);
            let e: number = this.e(player.pre.mu, opponent.pre.mu, opponent.pre.phi);

            outcomeBasedRating += oPhi * (sc - e);
        });

        return outcomeBasedRating;
    }
}