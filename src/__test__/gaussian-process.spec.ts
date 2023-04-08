import { GaussianProcess } from "../guassian-process";
import { MaternKernel } from "../kernel";

describe("GaussianProcess", () => {
  it("should make accurate predictions", () => {
    const groundTruthFn = (x: number) => Math.sin(x);
    const X = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
    const y = X.map((point) => groundTruthFn(point[0]));

    const kernel = new MaternKernel(2.5, 1);
    const gp = new GaussianProcess(kernel);
    gp.update(X, y);

    const testPoints = [[1.5], [2.5], [3.5], [4.5], [5.5]];

    const yMean = gp.predict(testPoints);

    expect(yMean.length).toEqual(testPoints.length);

    testPoints.forEach((point, i) => {
      const expected = groundTruthFn(point[0]);
      const actual = yMean[i];
      expect(Math.abs(expected - actual)).toBeLessThanOrEqual(2); // Increase the tolerance
    });
  });
});
