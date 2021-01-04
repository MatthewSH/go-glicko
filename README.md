# Glicko2
A TypeScript/JavaScript implementation of [Glicko2](https://www.glicko.net/glicko/glicko2.pdf) by Dr. Mark Glickman.

## Original Credits
This library is a conversion of [Aleksandr Zelenin's Go library](https://github.com/zelenin/go-glicko2) to NodeJS. All credit should go to them for the code, I just converted it to TypeScript. 

## Motivation for Conversion
When working with Glicko2 and using the composite opponent abstraction talked about in [this paper](https://rhetoricstudios.com/downloads/AbstractingGlicko2ForTeamGames.pdf) I used [Go](https://golang.org/). I wanted to use this same abstraction with NodeJS with another library I wrote for a game and found out the libraries available to us forced instances of a library to be maintained and had over complications that weren't really that needed amongst other things.

### Issues I've Seen with Other Libraries
*Please keep in mind these are my own personal issues with the libraries and they may be perfectly suited for you.*
- Complicated way of adding matches (pushing manual arrays).
- Requiring you to maintain match history (instead of just creating a period and tracking that).
- Not clearly communicating things like rating periods.
- Over complicated creation of players and rating periods.
- Just not having any documentation.

There's other things...but I don't want to hate too much. My goal with this is to convert one of the nicest Glicko2 libraries I've worked with over to another language.

## Installation
```
yarn add go-glicko
```

```
npm install go-glicko
```

## Usage
### TypeScript
```typescript
import { MatchResult, Period, Player, Rating } from 'go-glicko';

let players: { [key: string]: Player } = {
    'Gunner88': new Player(Rating.NewDefaultRating()),
    'Jennyfer89': new Player(new Rating(1400, 100, 0.06)),
    'Molly_Walsh': new Player(new Rating(2100, 10, 0.06)),
    'Jed41': new Player(new Rating(800, 38, 0.06)),
    'Denis86': new Player(new Rating(1600, 179, 0.06)),
    'Greenskull': new Player(new Rating(2800, 5, 0.06)),
}

let period = new Period();

Object.keys(players).forEach((name: string) => {
    period.addPlayer(players[name]);
});

period.addMatch(players['Greenskull'], players['Molly_Walsh'], MatchResult.WIN);
period.addMatch(players['Denis86'], players['Jed41'], MatchResult.LOSS);
period.addMatch(players['Denis86'], players['Jennyfer89'], MatchResult.WIN);

period.Calculate();

Object.keys(players).forEach((name: string) => {
    console.log(`${name}: ${players[name].Rating().R().toFixed(0)}±${players[name].Rating().RD().toFixed(0)}`)
});
```

### JavaScript
**NOTE: This project was written and is intended to be used in a TypeScript environment, however it is still usable in a pure JavaScript environment, it won't look too much different.**
```javascript
const Glicko2 = require("go-glicko");
let players = {
    'Gunner88': new Glicko2.Player(Glicko2.Rating.NewDefaultRating()),
    'Jennyfer89': new Glicko2.Player(new Glicko2.Rating(1400, 100, 0.06)),
    'Molly_Walsh': new Glicko2.Player(new Glicko2.Rating(2100, 10, 0.06)),
    'Jed41': new Glicko2.Player(new Glicko2.Rating(800, 38, 0.06)),
    'Denis86': new Glicko2.Player(new Glicko2.Rating(1600, 179, 0.06)),
    'Greenskull': new Glicko2.Player(new Glicko2.Rating(2800, 5, 0.06)),
};

let period = new Glicko2.Period();

Object.keys(players).forEach((name) => {
    period.addPlayer(players[name]);
});

period.addMatch(players['Greenskull'], players['Molly_Walsh'], Glicko2.MatchResult.WIN);
period.addMatch(players['Denis86'], players['Jed41'], Glicko2.MatchResult.LOSS);
period.addMatch(players['Denis86'], players['Jennyfer89'], Glicko2.MatchResult.WIN);
period.Calculate();

Object.keys(players).forEach((name) => {
    console.log(`${name}: ${players[name].Rating().R().toFixed(0)}±${players[name].Rating().RD().toFixed(0)}`);
});

```

### Expected Output
```
Gunner88: 1500±350
Jennyfer89: 1387±98
Molly_Walsh: 2100±14
Jed41: 808±39
Denis86: 1484±164
Greenskull: 2800±12
```


## FAQ
**What is tau (τ) and how is it gonna change the outcome?**

Let me let Dr. Glickman explain:
> The system constant, τ, which constrains the change in volatility over time, needs to beset prior to application of the system. Reasonable choices are between 0.3 and 1.2, though the system should be tested to decide which value results in greatest predictive accuracy. Smaller values of τ prevent the volatility measures from changing by large amounts, which in turn prevent enormous changes in ratings based on very improbable results. If the application of Glicko-2 is expected to involve extremely improbable collections of game outcomes, then τ should be set to a small value, even as small as, say, τ=0.2
>
> [Example of the Glicko-2 system](http://www.glicko.net/glicko/glicko2.pdf)


**Why do you add all players even if they don't play?**

Even if a player doesn't play any matches in the rating period, they still need added because their deviation will change over time. The system becomes less confident in their ability. If you took the same rating period example code I provided prior and ran the same period over and over, `Gunner88`'s rating deviation (set at `350`) would slowly increase.

**What order is the `addMatch` in?**

It's player1 vs. player2 with the match result being attributed to player1.

**Any benchmarks?**
Yes! You can view them all for NodeJS [here](https://glicko2.com/benchmarks/nodejs/). Please keep in mind that this library is fundamentally different then others that exist, so

**What's different between 1.0.0 and 1.1.0?**
When creating the benchmarks I realized there was a major issue with how I was adding players. While this worked fine in Go for what I was using it for it was detrimental in NodeJS.
So I added `uuid` and created a unique ID for each player added and instead of constantly looping through an array of players we just check if the ID exists in the Map. In initial testing this increased general performance over the object method by 3-10% and in general over v1.0.0 well...it took a 6.97 hour benchmark to about 7 seconds.