import { BayesianOptimizer } from "..";

describe("BayesianOptimizer", () => {
  it("should find the minimum of a quadratic function", async () => {
    const objectiveFunction = async (params: {
      [key: string]: number;
    }): Promise<number> => {
      const x = params.x;
      return -Math.pow(x - 3, 2);
    };

    const paramRanges = {
      x: {
        min: -10,
        max: 10,
      },
    };

    const numSteps = 150;

    const optimizer = new BayesianOptimizer();
    await optimizer.optimize(objectiveFunction, paramRanges, numSteps);

    const searchSpace = optimizer.getsearchSpace();

    expect(searchSpace).not.toBeNull();
    if (searchSpace) {
      expect(Math.abs(searchSpace.x - 3)).toBeLessThanOrEqual(0.5);
    }
  });
});
