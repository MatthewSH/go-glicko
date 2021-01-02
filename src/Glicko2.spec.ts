import { MatchResult } from './Match';
import { Period, Player, Rating } from './Glicko2';

let players: Player[] = [];
let period: Period;

test('players should be created with proper ratings', () => {
    players[0] = new Player(new Rating(1500, 200, 0.06));
    players[1] = new Player(new Rating(1400, 30, 0.06));
    players[2] = new Player(new Rating(1550, 100, 0.06));
    players[3] = new Player(new Rating(1700, 300, 0.06));

    expect(players.length).toEqual(4);
});

test('rating period should calculate correctly', () => {
    period = new Period();

    period.addMatch(players[0], players[1], MatchResult.WIN);
    period.addMatch(players[0], players[2], MatchResult.LOSS);
    period.addMatch(players[0], players[3], MatchResult.LOSS);

    period.Calculate();

    expect(parseFloat(players[0].Rating().R().toFixed(5))).toEqual(1464.05067);
    expect(parseFloat(players[0].Rating().RD().toFixed(5))).toEqual(151.51652);
    expect(players[0].Rating().Sigma()).toBeCloseTo(0.05999);
})