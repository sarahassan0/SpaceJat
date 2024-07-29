## JetStream Ordered Consumers

This simple Node.js app implements ordered consumers in the NATS message broker using JetStream. The goal is to ensure that the server processes client requests in the exact order they are received, maintaining the order of operations.

The project involves two clients making multiple simultaneous requests to the server. The server publishes each request to a JetStream stream, and the store consumes these requests in order, responding to every request from both clients.

## Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (if running without Docker)

## navigate to jetStream-ordered-consumers folder

```bash
cd jetStream-ordered-consumers
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
nodemon server/setup.js
nodemon server/server.js
./run.sh
```