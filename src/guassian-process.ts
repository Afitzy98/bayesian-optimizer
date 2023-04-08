import { IKernel } from "./kernel";

export class GaussianProcess {
  X: number[][] = [];
  y: number[] = [];
  K: number[][] = [];

  constructor(private kernel: IKernel) {}

  update(X: number[][], y: number[]): void {
    this.X = X;
    this.y = y;
    this.K = this.kernel.computeCovarianceMatrix(X);
  }

  predict(Xs: number[][]): number[] {
    const Ks = this.kernel.computeCovarianceMatrix(this.X, Xs);

    const L = this.cholesky(this.K);

    const alpha = this.solveLowerTriangular(L, this.y);
    this.solveUpperTriangular(
      L.map((row) => row.slice()),
      alpha
    );

    const yMean = Xs.map((_, j) =>
      Ks.reduce((sum, row, i) => sum + row[j] * alpha[i], 0)
    );

    return yMean;
  }

  private cholesky(A: number[][]): number[][] {
    const n = A.length;
    const L: number[][] = new Array(n)
      .fill(null)
      .map(() => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }

        if (i === j) {
          L[i][j] = Math.sqrt(A[i][j] - sum);
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }
      }
    }

    return L;
  }

  private solveLowerTriangular(L: number[][], b: number[]): number[] {
    const n = L.length;
    const x = Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * x[j];
      }
      x[i] = (b[i] - sum) / L[i][i];
    }

    return x;
  }

  private solveUpperTriangular(U: number[][], b: number[]): void {
    const n = U.length;

    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U[i][j] * b[j];
      }
      b[i] = (b[i] - sum) / U[i][i];
    }
  }
}
