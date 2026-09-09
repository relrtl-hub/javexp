# Java Atlas

A practical field guide to Java concepts, design patterns, data structures, algorithms, concurrency, backend tools, Kubernetes, testing, and system design.

The catalog is organized as a set of practical neighborhoods, with each subject kept to a focused 1–2 page read and linked to primary documentation for deeper investigation.

## Included in the first slice

- Java runtime: equals/hashCode, Java Memory Model
- JVM internals & GC: class loading, JIT compilation, heap behavior, garbage collection, and production diagnosis
- Streams & modern Java: stream pipelines, records, Optional, and modern API tradeoffs
- Exceptions & error handling: checked and unchecked failures, resource cleanup, causes, and retry boundaries
- Design patterns: Rule Engine, Singleton, Strategy, Factory Method, Builder, Decorator, Chain of Responsibility
- Kubernetes: components, object catalog, workloads, Service and networking, PV/PVC/StorageClass, config/RBAC, YAML, and Helm templates
- Containers, Git & architecture: Docker/Kubernetes map, Docker components, lifecycle, layers, registries, Git clone/fork, metadata lifecycle, service architecture, asset/fund modeling
- Collections and caching: LRU Cache, LFU Cache
- Data structures: Tree Traversal, Binary Search Tree
- Algorithms: Binary Search, Sliding Window
- Concurrency & async: CompletableFuture, Race Condition, Virtual Threads, Reactor, Vert.x
- Event streaming: Kafka, Apache Pulsar, Apache Flink
- Data services & OLAP: Redis, Aerospike, ClickHouse, Apache Pinot
- Edge delivery: Cloudflare Anycast CDN
- Lakehouse & formats: Apache Iceberg, Apache Parquet
- Testing and engineering: JUnit, Testcontainers
- System design: Rate Limiter, Circuit Breaker
- REST clients: JDK HttpClient, Spring RestClient, WebClient, JAX-RS/MicroProfile, OpenFeign, OkHttp, Retrofit, Apache HttpClient, and Vert.x Web Client

The intentionally excluded Java basics are classes and objects, interfaces, abstract classes, records, enums, and immutability.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Subject pages use hash URLs so the site stays dependency-light:

```text
/#rule-engine
/#kafka
/#lru-cache
/#category/design-patterns
```

## Checks

```bash
npm run lint
npm run build
```

## Project shape

```text
src/
├── App.tsx          Application shell, hierarchy, search, and subject layout
├── data.ts          Categories and declarative subject content
├── main.tsx         React entry point
└── styles.css       Responsive visual system

docs/
└── LOCAL-INFRASTRUCTURE.md   Future local Kafka/Redis/database lab design

public/doc-images/
└── image1.png ... image13.png  Extracted diagrams from the uploaded look4.docx reference
```

## Direction

This is content-first. Each page follows the same mental model, minimal example, tradeoffs, and further-investigation links. The local infrastructure lab is designed separately and is not connected to the public site yet.
