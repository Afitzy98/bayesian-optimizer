export interface IKernel {
  computeCovarianceMatrix(
    points1: number[][],
    points2?: number[][]
  ): number[][];
}

export class MaternKernel implements IKernel {
  constructor(private nu: number, private lengthScale: number) {}

  private maternKernelFn(x1: number, x2: number): number {
    const sqrt2Nu = Math.sqrt(2 * this.nu);
    const distance = Math.abs(x1 - x2) / this.lengthScale;
    const baseTerm = sqrt2Nu * distance;

    if (this.nu === 0.5) {
      return Math.exp(-baseTerm);
    } else if (this.nu === 1.5) {
      return (1 + baseTerm) * Math.exp(-baseTerm);
    } else if (this.nu === 2.5) {
      return (1 + baseTerm + baseTerm ** 2 / 3) * Math.exp(-baseTerm);
    } else {
      throw new Error(
        "Unsupported value for nu. Only 0.5, 1.5, and 2.5 are supported."
      );
    }
  }

  public computeCovarianceMatrix(
    points1: number[][],
    points2?: number[][]
  ): number[][] {
    if (!points2) {
      points2 = points1;
    }

    const n1 = points1.length;
    const n2 = points2.length;
    const covarianceMatrix: number[][] = new Array(n1)
      .fill(null)
      .map(() => new Array(n2).fill(0));

    for (let i = 0; i < n1; i++) {
      for (let j = 0; j < n2; j++) {
        covarianceMatrix[i][j] = this.maternKernelFn(
          points1[i][0],
          points2[j][0]
        );
      }
    }

    return covarianceMatrix;
  }
}
