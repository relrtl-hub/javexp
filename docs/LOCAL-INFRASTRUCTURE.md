# Local infrastructure lab

This is the design for the future hands-on part of Java Atlas. It is intentionally not implemented in the first vertical slice.

## Goal

Let a learner activate a real local dependency from the Java Atlas GUI, run a small experiment, inspect the result, and reset everything without learning Docker Compose syntax first.

The browser should never control Docker directly. A small local control service should own the boundary:

```text
Java Atlas UI
    │ HTTP on 127.0.0.1
    ▼
Local Lab Controller
    │ Docker Engine API or Compose CLI
    ▼
Kafka · Redis · PostgreSQL · Elasticsearch · Cassandra
```

## Service catalog

The controller should read one catalog entry per service. The catalog is data, not React code.

```yaml
id: redis
label: Redis
image: redis:7.4
category: cache
ports:
  - host: 6379
    container: 6379
healthcheck:
  command: redis-cli ping
  expect: PONG
profiles:
  - cache
  - backend
examples:
  - id: set-get
    label: Store and retrieve a value
    command: redis-cli SETEX java-atlas:demo 60 hello
```

Initial catalog entries:

- Redis
- PostgreSQL
- Kafka, preferably through a small single-node development image
- Elasticsearch
- Cassandra

Each entry should declare:

- Image and pinned version
- Ports
- Environment variables
- Persistent volume policy
- Health check
- Resource limits
- Start and reset behavior
- Safe example operations
- Java client dependency information
- Whether the service needs a companion service

## GUI experience

A future `Local Lab` page should have one card per service:

```text
Redis
In-memory key-value store

Status: stopped
[Start] [Open details]

Examples
[SET and GET] [Set a TTL] [Clear demo data]
```

The state model should be explicit:

```text
unavailable → starting → healthy
                    ↘ failed
healthy → stopping → stopped
healthy → resetting → healthy
```

The UI should show the actual health-check result, not just “start request sent”. A service is ready only after its health check passes.

## Profiles

Profiles reduce resource usage and keep the first click quick.

- `cache`: Redis
- `database`: PostgreSQL
- `streaming`: Kafka and its required companion services
- `search`: Elasticsearch
- `wide-column`: Cassandra
- `backend-basics`: Redis and PostgreSQL
- `all`: everything, with a clear warning about memory usage

Starting a profile should start only the services it owns. Stopping a profile should not delete volumes unless the user explicitly chooses Reset.

## Safety and local-only defaults

- Bind ports to `127.0.0.1`, not all network interfaces.
- Never commit passwords or API keys.
- Generate development credentials in the controller or use intentionally local defaults with a warning.
- Keep service data in named volumes outside the repository.
- Add memory and CPU limits where Docker supports them.
- Make Reset visibly destructive and require a confirmation step.
- Expose logs and connection details, but redact secrets.
- Treat the controller as a local privileged process. Do not expose it through the public deployed site.

## Java examples

Each tool page should eventually have two modes:

1. **Explain mode:** static code and a conceptual diagram.
2. **Lab mode:** the same example runs against the local service.

Example flow for Redis:

```text
Click Start Redis
  → controller starts the container
  → controller polls redis-cli ping
  → UI shows Healthy
  → click Set and GET
  → controller runs a safe operation
  → UI shows the returned value
```

The browser should not accept arbitrary shell commands. Start with a fixed allow-list of examples. A later advanced mode can expose a terminal only after the security model is deliberate.

## Suggested controller API

This is a future boundary, not part of the first build:

```text
GET  /api/services
GET  /api/services/:id/status
POST /api/services/:id/start
POST /api/services/:id/stop
POST /api/services/:id/reset
GET  /api/services/:id/logs
POST /api/services/:id/examples/:exampleId/run
```

Every mutating response should include the resulting status. The UI should then read the status endpoint again before showing Healthy.

## Implementation stages

### Stage 1: catalog and read-only UI

Show the service cards, requirements, ports, example descriptions, and a “local only” explanation. No controller and no containers yet.

### Stage 2: controller with Redis and PostgreSQL

Implement start, stop, health, logs, and reset for the two simplest services. Add real read/write examples and integration tests.

### Stage 3: Kafka

Add the broker plus its companion service configuration, then demonstrate produce, consume, and consumer-group behavior.

### Stage 4: Elasticsearch and Cassandra

Add index/document and keyspace/table examples, with explicit resource warnings.

### Stage 5: executable lesson mode

Connect a lesson page to one or more fixed examples and display the real output beside the explanation.

## Decision to keep

The content system and local service catalog should share one idea: each subject is declarative data rendered by the UI. That makes it possible to add a new tool page without rewriting the application shell, and later attach a lab adapter without making every page understand Docker.
