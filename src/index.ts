import { GaussianProcess } from "./guassian-process";
import { MaternKernel } from "./kernel";

// TODO: add verbose logging

export interface ParameterRange {
  min: number;
  max: number;
}

export interface BayesianOptimizerOptions {
  kernelNu?: number;
  kernelLengthScale?: number;
  numCandidates?: number;
  exploration?: number;
}

export type ObjectiveFunction = (
  params: Record<string, number>
) => Promise<number>;

export class BayesianOptimizer {
  private gp: GaussianProcess;
  private kernel: MaternKernel;
  private bestParams: Record<string, number> | null = null;
  private bestValue = -Infinity;
  private numCandidates: number;
  private exploration: number;

  constructor(options: BayesianOptimizerOptions = {}) {
    const {
      kernelNu = 1.5,
      kernelLengthScale = 1,
      numCandidates = 100,
      exploration = 0.01,
    } = options;

    this.kernel = new MaternKernel(kernelNu, kernelLengthScale);
    this.gp = new GaussianProcess(this.kernel);
    this.numCandidates = numCandidates;
    this.exploration = exploration;
  }

  async optimize(
    objectiveFunction: ObjectiveFunction,
    paramRanges: Record<string, ParameterRange>,
    numSteps: number,
    initialParams = this.generateRandomParams(paramRanges)
  ): Promise<void> {
    const X: number[][] = [];
    const y: number[] = [];

    // Initialize bestValue and searchSpace with the first random parameters
    const initialValue = await objectiveFunction(initialParams);
    const initialX = Object.values(initialParams);

    this.bestValue = initialValue;
    this.bestParams = initialParams;

    X.push(initialX);
    y.push(initialValue);

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

  getBestParams(): Record<string, number> | null {
    return this.bestParams;
  }

  private selectNextParams(
    paramRanges: Record<string, ParameterRange>,
    X: number[][]
  ): Record<string, number> {
    const firstCandidate = this.generateRandomParams(paramRanges);
    let bestCandidate: Record<string, number> = firstCandidate;
    let bestEI = this.expectedImprovement(Object.values(firstCandidate), X);

    for (let i = 1; i < this.numCandidates; i++) {
      const candidate = this.generateRandomParams(paramRanges);
      const x = Object.values(candidate);
      const ei = this.expectedImprovement(x, X);

      if (ei > bestEI) {
        bestEI = ei;
        bestCandidate = candidate;
      }
    }

    return bestCandidate;
  }

  private generateRandomParams(
    paramRanges: Record<string, ParameterRange>
  ): Record<string, number> {
    const params: Record<string, number> = {};

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
    const improvement = yMean - currentBest - this.exploration;

    return improvement;
  }
}
