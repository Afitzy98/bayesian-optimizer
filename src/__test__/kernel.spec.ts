import { MaternKernel } from "../kernel";

describe("MaternKernel", () => {
  const testCases = [
    { nu: 0.5, lengthScale: 1 },
    { nu: 1.5, lengthScale: 1 },
    { nu: 2.5, lengthScale: 1 },
  ];

  testCases.forEach(({ nu, lengthScale }) => {
    describe(`nu=${nu}, lengthScale=${lengthScale}`, () => {
      const kernel = new MaternKernel(nu, lengthScale);

      it("should have correct covariance matrix dimensions", () => {
        const X = [
          [1, 2],
          [3, 4],
          [5, 6],
        ];
        const covarianceMatrix = kernel.computeCovarianceMatrix(X);

        expect(covarianceMatrix.length).toEqual(X.length);
      });

      it("Check the diagonal elements of the covariance matrix are close to 1", () => {
        const X = [
          [1, 2],
          [3, 4],
          [5, 6],
        ];
        const covarianceMatrix = kernel.computeCovarianceMatrix(X);

        for (let i = 0; i < X.length; i++) {
          expect(Math.abs(covarianceMatrix[i][i] - 1)).toBeLessThanOrEqual(
            1e-6
          );
        }
      });
    });
  });

  it("should throw an erro as invalid value for nu is provided", () => {
    let e;
    try {
      const X = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const kernel = new MaternKernel(0, 1);
      kernel.computeCovarianceMatrix(X);
    } catch (err: any) {
      e = err;
    }
    expect(e.message).toEqual(
      "Unsupported value for nu. Only 0.5, 1.5, and 2.5 are supported."
    );
  });
});
