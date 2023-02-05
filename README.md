# WokerChallenge

<p align="center">
  <h2>WokerChallenge  - Scaling a third party API for collecing 150 samples in 10 seconds</h2>
</p>

This app is designed to perform sample collection and calculation efficiently. The process starts by retrieving the necessary configuration settings from the AppConfiguration.ts file. The app then launches a random number of workers on different ports, which are crucial components of the sample collection process. If the workers start without any issues, the app continues with collecting the samples by making calls to their endpoints. The collected samples are then processed to calculate the sum, number of samples, and time consumed, which provide valuable insights into the sample data. In case of any errors during the process, the app logs them for later analysis and troubleshooting. Finally, the app uses treekill to clean up (kill) the workers, freeing up resources and ensuring a smooth shutdown. Overall, this app plays a crucial role in streamlining the sample collection and calculation process and providing accurate results.

## Installation

```bash
$ npm install
```

## Quick start

-   You will need to have `Node.js` installed, this project has been tested with Node version [16.X](https://nodejs.org/en/blog/release/v12.22.1/)

```bash
# clone this repo
$ git clone https://github.com/aftab1001/worker-challenge.git
# go to payment-remainder dir
$ cd worker-challenge
# copy .env.example to .env for environment configuration
$ cp .env.example .env
# install dependencies
$ npm install

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run build
$ npm run start
```

## Available Scripts

-   `start` - run project in production environment,
-   `start:dev` - run project in dev environment,
-   `clean` - remove coverage data, Jest cache and transpiled files,
-   `prebuild` - lint source files and tests before building,
-   `build` - transpile TypeScript to ES6,
-   `lint` - lint source files and tests,
-   `lint:fix` - fix linting issues,
-   `prettier` - reformat files,
-   `test` - run tests,
-   `test:watch` - interactive watch mode to automatically re-run tests

## What's the stack used in this project?

-   **[TypeScript](https://www.typescriptlang.org/)** is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
-   **[Eslint](https://eslint.org/)** is a static code analysis tool for identifying problematic patterns found in JavaScript code.
-   **[Prettier](https://prettier.io/)** is to enforce consistent code style.
-   **[Jest](https://facebook.github.io/jest/)** is a testing platform from Facebook Code. It's easy to configure and provides out-of-the-box mocking and code coverage reporting.
-   **[TreeKill](https://www.npmjs.com/package/tree-kill)** is a crossplatform libray to kill the running workers.
