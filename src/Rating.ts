import MathUtils from './MathUtils';

export default class Rating 
{
    public static readonly SCALE_PARAMETER: number = 173.7178;
    public static readonly BASE_R: number = 1500;
    public static readonly BASE_RD: number = 350;
    public static readonly BASE_SIGMA: number = 0.06;

    public rating!: number;
    public ratingDeviation!: number;
    public sigma!: number;
    public mu!: number;
    public phi!: number;

    constructor(rating: number, ratingDeviation: number, sigma: number) {
        this.setRating(rating);
        this.setRD(ratingDeviation);
        this.setSigma(sigma);
    }

    public static NewDefaultRating() {
        return new Rating(this.BASE_R, this.BASE_RD, this.BASE_SIGMA);
    }

    public R(): number {
        return this.rating;
    }

    public RD(): number {
        return this.ratingDeviation;
    }

    public Sigma(): number {
        return this.sigma;
    }

    public ConfidenceInterval(): number[] {
        return [(this.R() - (2 * this.RD())), (this.R() + (2 * this.RD()))];
    }

    public Update(mu: number, phi: number, sigma: number) {
        this.setMu(mu);
        this.setPhi(phi);
        this.setSigma(sigma);
    }

    public Touch(): void {
        this.setPhi(MathUtils.phiA(this.phi, this.sigma));
    }

    public setRating(rating: number): void {
        this.rating = rating;
        this.mu = (this.rating - Rating.BASE_R) / Rating.SCALE_PARAMETER;
    }

    public setMu(mu: number): void {
        this.mu = mu;
        this.rating = this.mu * Rating.SCALE_PARAMETER + Rating.BASE_R;
    }

    public setRD(rd: number): void {
        this.ratingDeviation = rd;
        this.phi = this.ratingDeviation / Rating.SCALE_PARAMETER;
    }

    public setPhi(phi: number): void {
        this.phi = phi;
        this.ratingDeviation = this.phi * Rating.SCALE_PARAMETER;
    }

    public setSigma(sigma: number): void {
        this.sigma = sigma;
    }
}