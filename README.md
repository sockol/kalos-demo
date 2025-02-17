# Kalos Demo

This demo is an example of breadth, but very much not depth. There are many things that could be improved and added, but were skipped in the interest of time.
This was built using:

- UI: NextJS + Apollo
- API: GoLang + Nginx

## Features

- UI
  - Dashboard Page
  - A search bar(s) to filter transactions by Customer Name or Region
  - Real-time analytics
  - Add Transaction Page
- API
  - Integration with Exchangerate-API for storing amounts in USD
  - In-memory not-persistent data store
  - Stats calculation
- Proxy
  - Tie services together with docker-compose and nginx proxy

## Architecture Overview

Initially I was going to build things out like this:

- UI on NextJS, with a Node GQL server living on the same container, tRPC for talking to the api
- API on a separate Go server and container, with an endpoint to establish websocket connections for real time updates
- DB (Postgres) on a separate container
- Nginx to tie the services together for easy deployments
- Terraform deployments, with separate docker-compose configs per service to support deployments across EC2s
- Separate repos per project

But because I did not want to spend a week on this I decided to cut down these features:

- UI will talk to the API over rest. Less flexible but faster to build
- DB will be in-memory, mocked by the API server
- Polling instead of subscriptions. It is real(ish) time enough
- Not handling CI/CD and decployments here
- Monorepo, no sharing of common files (like protobuf files) across services
- Not production-ready. This is very much a dev build, I didn't even set prod envirovnments

## Installation

Install docker.
Head into the project root directory and run:

```
docker compose up --build
```

Done. See it at http://localhost

## In depth Architecture

There are many things that could be improved here, and the answer to why I made this decision vs another will likely be because of time. And I am sure there are redundancies that should be cleaned up, didn't get to all of them.

#### NGINX

This is the entry gateway. The intent for this was to centralize all access to the app through one place, where we can handle logging, installing observability agents, minification, handling https termination, caching, all the things you usually do with a proxy.

This server handles routing.

- /api/v1 -> routes to the API. It is versioned starting at v1
- / -> anything else is handled by NextJS

It would also handle routing between NextJS UI and the standalone GQL server but I cut that feature out.

#### UI

This is build on NextJS using the pages router. I tried the app router, it has too many incompatibility issues and the ecosystem does not support it 100% yet so I would wait before moving to it.

For the design system I went with [shadcn](https://ui.shadcn.com/). Seems like the most popular and minimalistic library these days. And it integrated with tailwind, which is what Kalos uses.

For GQL I used Apollo, it is what I am familiar with and it is a popular library with a ton of features. GQL schema is defined in src/graphql, and gql schema is saved there also. Every entity lives in a separate folder, with the `core` folder dedicated to macros like DateTime and UUID. GQL schema interospection is turned on at the default route [here](http://localhost/api/graphql)
The schema is generated with `npm run codegen`, config file is codegen.ts

For the styling, I spent 0 time thinking about how to make it pretty. So the UI can be done better:

- The add transaction form should be on the same page as the transactions table. But the nav looked empty so I put it into a separate page
- Error handling needs to be done better and more consistent when a form fails
- SSR does not work everywhere which makes navigation less seamless, we re-render the whole app instead of the page we navigate to

In terms of housekeeping I set up formatting with eslint + prettier. Ideally we enforce formatting on the CI/CD build stage where we run formatting against the codebase and if there is a diff we fail.

Table filtering - I am doing this on the client side because it is easier and we dont expect to have thousands of transactions that need to be paginated on the backend.

Also sales rep should be a dropdown, lazy loaded from the DB. And we should not be storing names, but rep ids per transaction.

#### API

Again, very minimalistic. This didn't have to even be Go but I already had a starter server built so I reused it. Routing is found in routes.go, here we have 4 of them:

```
// Check the server status
mux.GET("/", app.health)
// Get all transactions
mux.GET("/api/v1/orgs/:orgId/transactions", app.getTransactions)
// Get stats per org
mux.GET("/api/v1/orgs/:orgId/stats", app.getStats)

// Add transaction
mux.POST("/api/v1/orgs/:orgId/transactions", app.createTransaction)
```

All transactions are saved in memory in the `db` object. Since it is a "db" it also handles the stats calculation, all of these are materialized on read.

Testing is minimal - I checked the api routes with POSTMAN and thorugh the UI, but there is a unit test for the DB stats math since that is less straightforward.

In the interest of time there is 0 validation of inputs because of time. But if I did a lot of it would be moved to the DB layer and the middleware.
