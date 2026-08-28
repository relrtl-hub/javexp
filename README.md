# Java Atlas

A practical field guide to Java concepts, design patterns, data structures, algorithms, concurrency, backend tools, testing, and system design.

The first slice contains two subjects per category so the layout and content model can be evaluated before the catalog grows.

## Included in the first slice

- Java runtime: equals/hashCode, Java Memory Model
- Design patterns: Rule Engine, Singleton
- Collections and caching: LRU Cache, LFU Cache
- Data structures: Tree Traversal, Binary Search Tree
- Algorithms: Binary Search, Sliding Window
- Concurrency: CompletableFuture, Race Condition
- Backend tools: Kafka, Redis
- Testing and engineering: JUnit, Testcontainers
- System design: Rate Limiter, Circuit Breaker

The intentionally excluded Java basics are classes and objects, interfaces, abstract classes, records, enums, generics, exceptions, and immutability.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Subject pages use hash URLs so the first slice stays dependency-light:

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
```

## Direction

This is content-first. The next iteration should refine the visual language and page template based on the first slice. The local infrastructure lab is designed separately and is not connected to the public site yet.
