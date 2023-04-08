import { GaussianProcess } from "./gp";
import { MaternKernel } from "./kernel";

export interface ParameterRange {
  min: number;
  max: number;
}

export interface BayesianOptimizerOptions {
  kernelNu?: number;
  kernelLengthScale?: number;
  numCandidates?: number;
  explorationParameter?: number;
}

export type ObjectiveFunction = (params: {
  [key: string]: number;
}) => Promise<number>;

export class BayesianOptimizer {
  private gp: GaussianProcess;
  private kernel: MaternKernel;
  private bestParams: { [key: string]: number } | null = null;
  private bestValue = -Infinity;
  private numCandidates: number;
  private explorationParameter: number;

  constructor(options: BayesianOptimizerOptions = {}) {
    const {
      kernelNu = 1.5,
      kernelLengthScale = 1,
      numCandidates = 100,
      explorationParameter = 0.01,
    } = options;

    this.kernel = new MaternKernel(kernelNu, kernelLengthScale);
    this.gp = new GaussianProcess(this.kernel);
    this.numCandidates = numCandidates;
    this.explorationParameter = explorationParameter;
  }

  async optimize(
    objectiveFunction: ObjectiveFunction,
    paramRanges: { [key: string]: ParameterRange },
    numSteps: number
  ): Promise<void> {
    const X: number[][] = [];
    const y: number[] = [];

    for (let step = 0; step < numSteps; step++) {
      // Acquisition function: Expected Improvement (EI)
      const nextParams = this.selectNextParams(paramRanges, X);

      const value = await objectiveFunction(nextParams);
      const nextX = Object.values(nextParams);

      if (value > this.bestValue) {
        this.bestValue = value;
        this.bestParams = nextParams;
      }

      X.push(nextX);
      y.push(value);

      // Update the Gaussian process with the new observation
      this.gp.update(X, y);
    }
  }

  getBestParams(): { [key: string]: number } | null {
    return this.bestParams;
  }

  private selectNextParams(
    paramRanges: { [key: string]: ParameterRange },
    X: number[][]
  ): { [key: string]: number } {
    let bestCandidate: { [key: string]: number } | null = null;
    let bestEI = -Infinity;

    for (let i = 0; i < this.numCandidates; i++) {
      const candidate = this.generateRandomParams(paramRanges);
      const x = Object.values(candidate);
      const ei = this.expectedImprovement(x, X);

      if (ei > bestEI) {
        bestEI = ei;
        bestCandidate = candidate;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return bestCandidate!;
  }

  private generateRandomParams(paramRanges: {
    [key: string]: ParameterRange;
  }): { [key: string]: number } {
    const params: { [key: string]: number } = {};

    for (const paramName in paramRanges) {
      const range = paramRanges[paramName];
      params[paramName] = Math.random() * (range.max - range.min) + range.min;
    }

    return params;
  }

  private expectedImprovement(x: number[], X: number[][]): number {
    if (X.length === 0) return Infinity;

    const yMean = this.gp.predict([x])[0];
    const currentBest = Math.max(...this.gp.y);
    const improvement = yMean - currentBest - this.explorationParameter;

    return improvement;
  }
}
