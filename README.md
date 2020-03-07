# Content Cyborg API

This is a JS REST API built with [Architect](https://arc.codes) to be deployed on AWS.

## Setup

### Prerequisites

- [git](https://git-scm.com/)
- [npm (bundled with NodeJS)](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/install/)

### Installation

- `sudo docker pull amazon/dynamodb-local`
- `npm install -g @architect/architect`
- `git clone` this repository
- `cd content-cyborg-api`
- `npm install`

All set! To start a local sandbox, run `bin/run` and you should see the DynamoDB and Architect sandbox start up.
