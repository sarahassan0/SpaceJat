## JetStream Queuing

This simple node app is an implementation of streaming in nats message broker using Jetstream for queue groups model.

## Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (if running without Docker)

## navigate to jetStream-queuing folder

```bash
cd jetStream-queuing
```


## Run the project

### Step 1: Run NATS Server

Ensure a NATS server is running locally with jetstream flag:

```bash
nats-server -js
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Services

Run each service in a separate terminal:

```bash
nodemon setup.js
nodemon pusher.js
nodemon queue-group/first-worker.js
nodemon queue-group/second-worker.js
```