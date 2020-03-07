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

### Deployment

TODO
