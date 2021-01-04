import Match from './Match';
import Rating from './Rating';

export default class Player 
{
    public pre: Rating;
    public post: Rating;
    public matches: Match[];

    constructor(pre: Rating) {
        this.pre = pre;
        this.post = new Rating(this.pre.R(), this.pre.RD(), this.pre.Sigma());
        this.matches = [];
    }

    public static NewDefaultPlayer(): Player {
        return new Player(Rating.NewDefaultRating());
    }

    public Rating(): Rating {
        return this.post;
    }

    public addMatch(match: Match) {
        this.matches.push(match);
    }
}