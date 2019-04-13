# Rchain.cloud node image

**Custom RNode docker image, specifically built for rchain.cloud.**

## Introduction

This docker image runs a standalone RNode instance with a custom configuration.
It also runs a thin HTTP and Websocket server, which allows the client to interact
with it using simple HTTP requests.


## Running it locally

```bash
docker run \
  -p 80:3000 \
  -it docker-rnode-http:latest
```

Using the above command, the HTTP API will be available on localhost:3000.
You might also want to open up ports 40400-40404 for debugging.


## HTTP API

### `GET /v1/node/version`

Returns the node version.

**Response format:**

```js
{
  "version": "RChain Node 0.6.4 (7d632567a616e6e63d4fca081191afae0a4d458d)"
}
```

### `GET /v1/node/health`

Health check endpoint. Checks both if the HTTP server and the node itself are
online and reachable.

**Response format:**

```js
{
  "status": "ok"
}
```

### `POST /v1/node/eval` (WIP)

Evaluates a Rholang contract. Note that when an infinitely running structure is
part of your code, the execution will halt after 10 seconds.

Every execution will have its own unique ID, and list the calculated deployment
cost for the contract.

**POST fields:**

- string `program`: the Rholang code you want to execute

**Response format:**

```js
{
  "id": "d1dfb28e-33f1-404b-9975-1dcecc9dc61b",
  "deploymentCost": "CostAccount(17,Cost(361))",
  "version": "RChain Node 0.6.4 (7d632567a616e6e63d4fca081191afae0a4d458d)",
  "output": [
    ["evaluation", "new x0, x1, x2 in { ..."],
    ["stdout", "@{"hello, world!"}"],
    ["stderr", "@{Set(1, 2, 3)}"],
    ["error", "Top level free variables are not allowed: myName at 3:13."]
  ]
}
```
