export default class MathUtils 
{
    public static sigmaP(delta: number, sigma: number, phi: number, v: number, tau: number): number {
        let a: number = Math.log(Math.pow(sigma, 2));
        let A: number = a;

        let fX = ((x: number, delta: number, phi: number, v: number, a: number, tau: number) => {
            return ((Math.exp(x) * (Math.pow(delta, 2) - Math.pow(phi, 2) - v - Math.exp(x))) / (2 * Math.pow((Math.pow(phi, 2) + v + Math.exp(x)), 2))) - ((x - a) / Math.pow(tau, 2));
        });

        let epsilon: number = 0.000001;
        let B: number;

        if (Math.pow(delta, 2) > (Math.pow(phi, 2) + v)) {
            B = Math.log(Math.pow(delta, 2) - Math.pow(phi, 2) - v);
        } else {
            let k = 1;

            while(fX(a - k * tau, delta, phi, v, a, tau) < 0) {
                k++;
            }

            B = a - k * tau;
        }

        let fA = fX(A, delta, phi, v, a, tau);
        let fB = fX(B, delta, phi, v, a, tau);

        while (Math.abs(B - A) > epsilon) {
            let C = A + fA * (A - B) / (fB - fA);
            let fC = fX(C, delta, phi, v, a, tau);

            if ((fC * fB) < 0) {
                A = B;
                fA = fB;
            } else {
                fA = fA / 2;
            }

            B = C;
            fB = fC;
        }

        return Math.exp(A / 2);
    }

    public static phiA(phi: number, sigmaP: number): number {
        return Math.sqrt(Math.pow(phi, 2) + Math.pow(sigmaP, 2));
    }

    public static phiP(phiS: number, v: number): number {
        return 1 / Math.sqrt(1 / Math.pow(phiS, 2) + 1 / v);
    }

    public static muP(mu: number, phiP: number, delta: number): number {
        return mu + Math.pow(phiP, 2) * delta;
    }
}