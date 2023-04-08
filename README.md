<h1 align="center" style="border-bottom: none;">📈 Bayesian Optimizer</h1>
<h3 align="center">A JavaScript library for optimizing black-box functions using Bayesian optimization with Gaussian processes</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/bayesian-optimizer">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/bayesian-optimizer/latest.svg">
  </a>
  <a href="https://github.com/Afitzy98/bayesian-optimizer/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/Afitzy98/bayesian-optimizer">
  </a>
  <a href="https://github.com/Afitzy98/bayesian-optimizer/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/Afitzy98/bayesian-optimizer">
  </a>
  <a href="#badge">
    <img alt="Co-authored by GPT-4" src="https://img.shields.io/badge/Co--authored%20by-GPT--4-blue">
  </a>
</p>

Bayesian Optimizer is a JavaScript library for optimizing black-box functions using Bayesian optimization with Gaussian processes.

## Features

- Supports multi-dimensional input spaces.
- Adjustable optimization parameters (exploration, number of candidates, etc.).
- Gaussian process regression with the Matérn kernel.
- Expected Improvement acquisition function
- Zero dependencies

## Installation

Install the package using npm:

```bash
npm install bayesian-optimizer
```

or yarn:

```bash
yarn add bayesian-optimizer
```

## Usage

```javascript
import { BayesianOptimizer } from "bayesian-optimizer";

// Define your objective function
const objectiveFunction = (params) => {
  // Your objective function logic here
  // Example: return -(params.x ** 2 + params.y ** 2);
};

// Define the search space for the objective function
const searchSpace = {
  x: { min: -5, max: 5 },
  y: { min: -5, max: 5 },
};

// Initialize the optimizer
const optimizer = new BayesianOptimizer({
  exploration: 0.1, // Optional, default is 0.01
  numCandidates: 100, // Optional, default is 100
  kernelNu: 1.5, // Optional, default is 1.5
  kernelLengthScale: 1.0, // Optional, default is 1.0
});

// Optimize the objective function
optimizer.optimize(objectiveFunction, searchSpace, 100);

// Get the best parameters found
const bestParams = optimizer.getBestParams();
```

## API

### BayesianOptimizer

The main class for performing Bayesian optimization.

#### `constructor(options?: { exploration?: number; numCandidates?: number; kernelNu?: number; kernelLengthScale?: number })`

Create a new instance of the BayesianOptimizer.

- `options`: An optional object with the following properties:
  - `exploration`: The exploration parameter (xi) for the Expected Improvement acquisition function. Default is `0.01`. Controls the exploration-exploitation trade-off.
  - `numCandidates`: The number of candidates sampled for each optimization step. Default is `100`.
  - `kernelNu`: Controls the smoothness of the Squared Exponential kernel. Default is `1.5`.
  - `kernelLengthScale`: Controls the length scale of the Squared Exponential kernel. Default is `1.0`.

#### `optimize(objectiveFunction: ObjectiveFunction, searchSpace: { [key: string]: ParameterRange }, numSteps:number): void`

Optimize the given objective function over the specified search space for a certain number of steps.

- `objectiveFunction`: The function to optimize.
- `searchSpace`: An object that defines the ranges of the parameters for the objective function.
- `numSteps`: The number of steps to perform the optimization.

#### `getBestParams(): { [key: string]: number } | null`

Returns the best parameters found during the optimization.

# Implementation details

## Gaussian Process and Matérn Kernel

Bayesian optimization relies on Gaussian process regression, which is a powerful technique for modeling an unknown function using a set of observed data points. In this library, we use the Matérn kernel as the covariance function for the Gaussian process. The Matérn kernel is a popular choice in Bayesian optimization due to its flexibility and ability to model various degrees of smoothness in the underlying function.

The Matérn kernel has two parameters, ν (nu) and l (length scale), which can be adjusted to control the smoothness and scale of the function being modeled. By default, this library uses a ν of 2.5 and a length scale of 1. These default values can be overridden by providing the `kernelNu` and `kernelLengthScale` options when initializing the BayesianOptimizer.

## Acquisition Function

In Bayesian optimization, the acquisition function is used to determine which points in the search space should be evaluated next. The most commonly used acquisition function is Expected Improvement (EI), which balances exploration and exploitation by calculating the expected improvement of a potential candidate point over the current best point.

The EI acquisition function can be defined as follows:

## Author

- Aaron Fitzpatrick ([Afitzy98](https://github.com/Afitzy98))

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository.

### Possible Expansions

There are several possible expansions that could be added to to this library. One possible expansion is the addition of other acquisition functions, such as Probability of Improvement (PI) or Upper Confidence Bound (UCB), which are also commonly used in Bayesian optimization. Another possible expansion is the inclusion of other kernel functions, which can affect the smoothness and scale of the function being modeled. Adding more kernel functions would increase the flexibility of the library and allow users to model a wider range of functions.

## License

MIT License
