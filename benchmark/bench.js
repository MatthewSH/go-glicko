const bench = require('nanobench');
const glicko = require('../');

let players = [];
let matches = [];
let scores = [1.0, 0.5, 0.0];
let period;

bench('create 25,000 players and 75,000 matches.', (b) => {
    b.start();

    let i = 25000;

    do {
        players.push(new glicko.Player(new glicko.Rating(randBetween(1000, 2500), randBetween(50, 350), 0.06)));
        i--;
    } while (i > 0);

    i = 75000;

    do {
        matches.push({
            1: players[randBetween(0, 24999)],
            2: players[randBetween(0, 24999)],
            score: scores[randBetween(0, 2)],
        })
        i--;
    } while (i > 0);

    b.end();
});

bench('create the rating period.', (b) => {
    b.start();

    period = new glicko.Period();
    
    b.end();
});

bench('add all players to the rating period.', (b) => {
    b.start();

    let i = 24999;

    do {
        period.addPlayer(players[i]);
        i--;
    } while (i > 1);
    
    b.end();
});

bench('add all matches to rating period.', (b) => {
    b.start();

    let i = 74999;

    do {
        period.addMatch(matches[i]['1'], matches[i]['2'], matches[i]['score']);
        i--;
    } while (i > 1);
    
    b.end();
});

bench('running calculation', (b) => {
    b.start();

    period.Calculate();
    
    b.end();
});

function randBetween(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}