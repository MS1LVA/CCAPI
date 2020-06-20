# Content Cyborg API

This is a JS REST API built with [Architect](https://arc.codes) to be deployed on AWS.

## How does this work?

The `.arc` file at the root of the project is the configuration for the whole project. Endpoints are defined there, and the JS for each endpoint lives in a directory that mirrors its definition -- ([Reference](https://arc.codes/reference/arc/http)).

## Setup

### Prerequisites

- [git](https://git-scm.com/)
- [npm (bundled with NodeJS)](https://nodejs.org/en/)

### Installation

- `npm install -g @architect/architect`
- `git clone` this repository
- `cd content-cyborg-api`
- `arc hydrate` runs `npm install` in each function in the `src` folder.

All set! To start a local sandbox, run `bin/run` and you should see the DynamoDB and Architect sandbox start up.

#### Important note

Be careful where you run `arc` commands from, if you run a `hydrate` or `sandbox` from somewhere other than the project root, it may create a weird file structure.

### Testing

Test Driven Development is very important to our development philosophy on this project. The basic principle is that you write your test before you write your code. Not the whole finished product, but enough that you can then write some code to make the test pass. When the test passes, you add more into the test, and repeat until you have a finished and tested, library, event, queue, etc.

Place tests in `<project-root>/lib/:lib/test/*.js` _or_ `<project-root>/test/:type/:handler/*.js`.

To run all tests, simply run `npm test`.

If you're working on one specific test and don't want to run the whole suite on each iteration, I recommend running these commands from project root:

```
mkdir tmp
touch tmp/test
chmod 700 tmp/test
echo npm run test -- --path=path/to/your/target/test/directory/relative/to/project/root > tmp/test
```

### Deployment

TODO
