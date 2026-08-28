export type Category = {
  id: string
  label: string
  description: string
}

export type SubjectSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export type Subject = {
  slug: string
  title: string
  category: string
  summary: string
  level: 'Foundations' | 'Intermediate' | 'Advanced'
  minutes: number
  tags: string[]
  takeaway: string
  diagram?: string[]
  codeLabel: string
  codeNote: string
  code: string
  sections: SubjectSection[]
}

export const categories: Category[] = [
  { id: 'java-runtime', label: 'Java runtime', description: 'The rules behind everyday Java behavior.' },
  { id: 'design-patterns', label: 'Design patterns', description: 'Small structures for keeping code changeable.' },
  { id: 'collections-caching', label: 'Collections & caching', description: 'Fast access, eviction, and data organization.' },
  { id: 'data-structures', label: 'Data structures', description: 'The shapes your data takes in memory.' },
  { id: 'algorithms', label: 'Algorithms', description: 'Repeatable ways to solve common problems.' },
  { id: 'concurrency', label: 'Concurrency', description: 'Multiple tasks without mystery or optimism.' },
  { id: 'backend-tools', label: 'Backend tools', description: 'Kafka, Redis, and the local-service layer.' },
  { id: 'testing-engineering', label: 'Testing & engineering', description: 'Confidence before production finds you.' },
  { id: 'system-design', label: 'System design', description: 'Patterns for systems that have to keep working.' },
]

export const subjects: Subject[] = [
  {
    slug: 'equals-and-hashcode',
    title: 'equals() and hashCode()',
    category: 'java-runtime',
    summary: 'Make objects behave correctly when Java compares them or stores them in hash-based collections.',
    level: 'Foundations',
    minutes: 6,
    tags: ['objects', 'HashMap', 'contracts'],
    takeaway: 'If two objects are equal, they must have the same hash code.',
    codeLabel: 'User.java',
    codeNote: 'Use the same fields in both methods, and prefer immutable identity fields.',
    code: `import java.util.Objects;\n\nrecord User(String email) {\n    @Override\n    public boolean equals(Object other) {\n        return other instanceof User user\n            && Objects.equals(email, user.email);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(email);\n    }\n}`,
    sections: [
      { heading: 'The simple rule', paragraphs: ['equals() answers whether two values represent the same thing. hashCode() produces a bucket number used by HashMap, HashSet, and related collections.', 'Java collections use hashCode() first, then equals() when multiple values land in the same bucket.'] },
      { heading: 'The contract', bullets: ['equals() should be reflexive, symmetric, transitive, consistent, and false for null.', 'Equal objects must return the same hash code.', 'Do not use mutable fields for identity while an object is inside a hash collection.'] },
      { heading: 'When it bites', paragraphs: ['A mutable key can become impossible to find after its hash code changes. That bug is quiet, legal, and irritating, which is a very Java combination.'] },
    ],
  },
  {
    slug: 'java-memory-model',
    title: 'Java Memory Model',
    category: 'java-runtime',
    summary: 'Understand when one thread is guaranteed to see a value written by another thread.',
    level: 'Advanced',
    minutes: 9,
    tags: ['threads', 'visibility', 'volatile'],
    takeaway: 'Visibility and ordering are guarantees, not guesses about what the CPU will probably do.',
    diagram: ['Thread A writes', 'happens-before relationship', 'Thread B reads'],
    codeLabel: 'Worker.java',
    codeNote: 'volatile makes the flag visible across threads, but it does not make compound operations atomic.',
    code: `final class Worker {\n    private volatile boolean running = true;\n\n    void stop() {\n        running = false;\n    }\n\n    void work() {\n        while (running) {\n            doSmallUnitOfWork();\n        }\n    }\n\n    private void doSmallUnitOfWork() { }\n}`,
    sections: [
      { heading: 'What it solves', paragraphs: ['Modern CPUs and compilers reorder work for speed. The Java Memory Model defines which reads and writes are visible between threads.', 'A happens-before relationship gives you a reliable visibility and ordering guarantee.'] },
      { heading: 'Tools that create guarantees', bullets: ['volatile gives visibility and ordering for a field.', 'synchronized and locks give mutual exclusion plus visibility.', 'Atomic classes provide atomic operations for specific values.', 'Thread start(), join(), and concurrent collections also establish defined relationships.'] },
      { heading: 'What volatile does not do', paragraphs: ['volatile++ is still a read followed by a write. Multiple threads can interleave those operations. Use AtomicInteger or a lock for compound updates.'] },
    ],
  },
  {
    slug: 'rule-engine',
    title: 'Rule Engine',
    category: 'design-patterns',
    summary: 'Evaluate independent business rules against a context while keeping orchestration out of the rules themselves.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['strategy', 'business logic', 'composition'],
    takeaway: 'The engine owns evaluation order. Each rule owns one decision.',
    diagram: ['Context', 'Sort by priority', 'Check condition', 'Execute matching action'],
    codeLabel: 'RuleEngine.java',
    codeNote: 'This version executes every matching rule, from highest priority to lowest.',
    code: `import java.util.Comparator;\nimport java.util.List;\n\ninterface Rule<C> {\n    int priority();\n    boolean matches(C context);\n    void execute(C context);\n}\n\nfinal class RuleEngine<C> {\n    void evaluate(List<Rule<C>> rules, C context) {\n        rules.stream()\n            .sorted(Comparator.comparingInt(Rule<C>::priority).reversed())\n            .filter(rule -> rule.matches(context))\n            .forEach(rule -> rule.execute(context));\n    }\n}`,
    sections: [
      { heading: 'The simple model', paragraphs: ['A rule has a condition and an action. The engine decides which rules run and in what order.', 'This prevents one giant method from becoming a museum of business exceptions.'] },
      { heading: 'Decisions to make', bullets: ['Should evaluation stop after the first match?', 'What happens when two rules have the same priority?', 'Should a failed action stop the engine?', 'Are conditions pure, or can they call external services?'] },
      { heading: 'Good fit', paragraphs: ['Use this when rules change independently or new rules are added regularly. For a short, stable if/else chain, this is probably more furniture than house.'] },
    ],
  },
  {
    slug: 'singleton',
    title: 'Singleton',
    category: 'design-patterns',
    summary: 'Expose one shared instance, while understanding why global state and hidden dependencies make this pattern controversial.',
    level: 'Intermediate',
    minutes: 7,
    tags: ['global state', 'enum', 'dependency injection'],
    takeaway: 'A singleton controls construction. It does not automatically make shared state safe.',
    codeLabel: 'AppConfig.java',
    codeNote: 'The enum form is safe from ordinary reflection and serialization attacks.',
    code: `public enum AppConfig {\n    INSTANCE;\n\n    public String environment() {\n        return "local";\n    }\n}`,
    sections: [
      { heading: 'Why it exists', paragraphs: ['Some resources should be shared, such as a process-wide configuration or a metrics registry. A singleton ensures a single instance inside one class loader.'] },
      { heading: 'Ways to bypass the idea', bullets: ['Reflection can create another instance for ordinary classes.', 'Serialization can create another object unless readResolve() is used.', 'Cloning can produce a second object.', 'Separate class loaders or separate JVMs create separate singleton instances.'] },
      { heading: 'My default', paragraphs: ['Prefer dependency injection. Let the application composition root create one object and pass it where needed. The dependency remains visible and tests remain less theatrical.'] },
    ],
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    category: 'collections-caching',
    summary: 'Keep the most recently used values and evict the one that has been idle the longest.',
    level: 'Intermediate',
    minutes: 7,
    tags: ['LinkedHashMap', 'eviction', 'O(1)'],
    takeaway: 'LRU needs fast lookup and fast reordering, which is why a hash map plus linked list is the classic shape.',
    diagram: ['get / put', 'Map lookup', 'Move to most-recent end', 'Evict oldest when full'],
    codeLabel: 'LruCache.java',
    codeNote: 'LinkedHashMap can maintain access order for us.',
    code: `import java.util.LinkedHashMap;\n\nfinal class LruCache<K, V> extends LinkedHashMap<K, V> {\n    private final int capacity;\n\n    LruCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n\n    @Override\n    protected boolean removeEldestEntry(Entry<K, V> eldest) {\n        return size() > capacity;\n    }\n}`,
    sections: [
      { heading: 'How it works', paragraphs: ['The map gives average O(1) lookup. The linked order tracks recent access. On every get or put, the entry moves to the recent end.'] },
      { heading: 'Complexity', bullets: ['Lookup: average O(1)', 'Insert: average O(1)', 'Eviction: O(1)', 'Space: O(capacity)'] },
      { heading: 'Production checklist', bullets: ['Decide whether the cache is thread-safe.', 'Add TTL if old data can be wrong even when recently used.', 'Measure hit rate, evictions, and memory usage.', 'Protect expensive cache misses from a stampede.'] },
    ],
  },
  {
    slug: 'lfu-cache',
    title: 'LFU Cache',
    category: 'collections-caching',
    summary: 'Evict the values used the fewest times, breaking ties with recency.',
    level: 'Advanced',
    minutes: 10,
    tags: ['frequency', 'eviction', 'cache policy'],
    takeaway: 'LFU remembers popularity, not just recent activity.',
    diagram: ['Key → node', 'Frequency → ordered keys', 'Track minimum frequency', 'Evict oldest key in that bucket'],
    codeLabel: 'LfuCache.java',
    codeNote: 'The key structures are the important part. A production version also needs a clear concurrency policy.',
    code: `final class Entry<K, V> {\n    K key;\n    V value;\n    int frequency = 1;\n}\n\n// Required indexes:\nMap<K, Entry<K, V>> entries;\nMap<Integer, LinkedHashSet<K>> keysByFrequency;\nint minimumFrequency;\n\n// On access: move the key from frequency f to f + 1.\n// On eviction: remove the oldest key in minimumFrequency.` ,
    sections: [
      { heading: 'Why it is different', paragraphs: ['LRU favors what was used recently. LFU favors what is used repeatedly. A rarely used item that was accessed just now can still be evicted by LFU.'] },
      { heading: 'The usual tie-breaker', paragraphs: ['If several entries have the same frequency, use recency inside that frequency bucket. LinkedHashSet is a useful building block for that job.'] },
      { heading: 'When to choose it', paragraphs: ['LFU can work well when a small set of hot keys should remain cached for a long time. It costs more bookkeeping and can keep historical popularity around longer than you expect.'] },
    ],
  },
  {
    slug: 'tree-traversal',
    title: 'Tree Traversal',
    category: 'data-structures',
    summary: 'Visit every node in a tree in an order that matches the problem you are solving.',
    level: 'Foundations',
    minutes: 7,
    tags: ['recursion', 'DFS', 'BFS'],
    takeaway: 'Traversal order is not decoration. It determines what information is available when you visit a node.',
    diagram: ['Root', 'Left subtree', 'Right subtree'],
    codeLabel: 'Traversal.java',
    codeNote: 'This is inorder traversal: left, root, right.',
    code: `record Node(int value, Node left, Node right) {}\n\nstatic void inOrder(Node node) {\n    if (node == null) return;\n\n    inOrder(node.left());\n    System.out.println(node.value());\n    inOrder(node.right());\n}`,
    sections: [
      { heading: 'The four common orders', bullets: ['Preorder: root, left, right.', 'Inorder: left, root, right.', 'Postorder: left, right, root.', 'Breadth-first: level by level.'] },
      { heading: 'Complexity', paragraphs: ['Every traversal visits n nodes, so time is O(n). Recursive depth-first traversal uses O(h) stack space, where h is the tree height.'] },
      { heading: 'Useful clue', paragraphs: ['Inorder traversal of a binary search tree produces sorted values. Postorder is useful when children must be processed before their parent.'] },
    ],
  },
  {
    slug: 'binary-search-tree',
    title: 'Binary Search Tree',
    category: 'data-structures',
    summary: 'Organize values so smaller items go left and larger items go right.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['BST', 'ordering', 'search'],
    takeaway: 'A balanced tree gives logarithmic operations. A lopsided tree is a linked list wearing a hat.',
    codeLabel: 'Bst.java',
    codeNote: 'This recursive insert keeps the example small. Production trees need a balancing strategy when input can be ordered.',
    code: `record Node(int value, Node left, Node right) {}\n\nstatic Node insert(Node node, int value) {\n    if (node == null) return new Node(value, null, null);\n\n    if (value < node.value()) {\n        return new Node(node.value(), insert(node.left(), value), node.right());\n    }\n\n    return new Node(node.value(), node.left(), insert(node.right(), value));\n}`,
    sections: [
      { heading: 'The invariant', paragraphs: ['Every value in the left subtree is smaller than the node. Every value in the right subtree is larger, or follows whatever duplicate policy you chose.'] },
      { heading: 'Complexity', bullets: ['Average search, insert, delete: O(log n) when balanced.', 'Worst-case search, insert, delete: O(n).', 'Height is the deciding factor.'] },
      { heading: 'Real alternatives', paragraphs: ['Use TreeMap when you need a tested ordered map. Use a red-black tree, AVL tree, or another balanced structure when you are implementing the data structure itself.'] },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    category: 'algorithms',
    summary: 'Find a value in sorted data by removing half of the remaining search space after each comparison.',
    level: 'Foundations',
    minutes: 6,
    tags: ['sorted data', 'O(log n)', 'search'],
    takeaway: 'Binary search is fast because it discards half the possibilities, not because it compares faster.',
    codeLabel: 'Search.java',
    codeNote: 'The input must be sorted in ascending order.',
    code: `static int binarySearch(int[] values, int target) {\n    int low = 0;\n    int high = values.length - 1;\n\n    while (low <= high) {\n        int middle = low + (high - low) / 2;\n        if (values[middle] == target) return middle;\n        if (values[middle] < target) low = middle + 1;\n        else high = middle - 1;\n    }\n\n    return -1;\n}`,
    sections: [
      { heading: 'The invariant', paragraphs: ['At every loop, if the target exists, it is between low and high. Each comparison shrinks that interval.'] },
      { heading: 'Complexity', bullets: ['Time: O(log n)', 'Space: O(1) for the iterative version', 'Input requirement: sorted data'] },
      { heading: 'Common bugs', bullets: ['Using low + high can overflow for large indexes.', 'Forgetting to move past middle causes infinite loops.', 'Searching unsorted data makes the result meaningless.'] },
    ],
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    category: 'algorithms',
    summary: 'Turn repeated range work into one moving window over a sequence.',
    level: 'Intermediate',
    minutes: 7,
    tags: ['arrays', 'two pointers', 'O(n)'],
    takeaway: 'Add what enters the window and remove what leaves it. Do not recalculate the whole window.',
    codeLabel: 'Window.java',
    codeNote: 'This finds the maximum sum of any fixed-size window.',
    code: `static int maxWindowSum(int[] values, int size) {\n    int window = 0;\n    for (int i = 0; i < size; i++) window += values[i];\n\n    int best = window;\n    for (int right = size; right < values.length; right++) {\n        window += values[right] - values[right - size];\n        best = Math.max(best, window);\n    }\n    return best;\n}`,
    sections: [
      { heading: 'The idea', paragraphs: ['A naive solution calculates every range from scratch. A sliding window reuses the previous range and changes only the two edges.'] },
      { heading: 'Complexity', bullets: ['Time: O(n)', 'Space: O(1) for a fixed-size numeric window', 'Works best when the problem has contiguous ranges.'] },
      { heading: 'Variable windows', paragraphs: ['For constraints such as “longest substring without duplicates”, move the right edge forward and move the left edge until the window becomes valid again.'] },
    ],
  },
  {
    slug: 'completable-future',
    title: 'CompletableFuture',
    category: 'concurrency',
    summary: 'Compose asynchronous work as a pipeline instead of blocking after every step.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['async', 'pipelines', 'executors'],
    takeaway: 'An asynchronous pipeline is still a program. Name its executor, failure path, and ownership.',
    diagram: ['Start asynchronously', 'Transform result', 'Handle failure', 'Join at the boundary'],
    codeLabel: 'Async.java',
    codeNote: 'Use a named executor in real services instead of silently sharing the common pool.',
    code: `var executor = Executors.newVirtualThreadPerTaskExecutor();\n\nCompletableFuture<String> result = CompletableFuture\n    .supplyAsync(() -> loadUserName(), executor)\n    .thenApply(String::toUpperCase)\n    .exceptionally(error -> "UNKNOWN");\n\nSystem.out.println(result.join());\nexecutor.close();`,
    sections: [
      { heading: 'The pipeline', paragraphs: ['supplyAsync starts work and returns a future. thenApply transforms a successful result. exceptionally supplies a fallback when the pipeline fails.'] },
      { heading: 'Important choices', bullets: ['Use thenApply for a synchronous transformation.', 'Use thenCompose when the next step also returns a future.', 'Use handle when success and failure both need to be processed.', 'Choose an executor that matches the workload.'] },
      { heading: 'Do not hide the boundary', paragraphs: ['join() and get() block. That is fine at an application boundary, but putting them inside every stage turns async code back into expensive synchronous code with more punctuation.'] },
    ],
  },
  {
    slug: 'race-condition',
    title: 'Race Condition',
    category: 'concurrency',
    summary: 'A bug where the result depends on the timing or interleaving of concurrent operations.',
    level: 'Foundations',
    minutes: 7,
    tags: ['threads', 'atomicity', 'synchronization'],
    takeaway: 'If multiple threads update shared state, make the operation atomic or remove the shared state.',
    codeLabel: 'Counter.java',
    codeNote: 'AtomicInteger makes increment a single atomic operation.',
    code: `import java.util.concurrent.atomic.AtomicInteger;\n\nfinal class Counter {\n    private final AtomicInteger value = new AtomicInteger();\n\n    void increment() {\n        value.incrementAndGet();\n    }\n\n    int value() {\n        return value.get();\n    }\n}`,
    sections: [
      { heading: 'Why it happens', paragraphs: ['value++ looks like one operation but is actually read, add, and write. Two threads can read the same old value and overwrite each other.'] },
      { heading: 'Ways out', bullets: ['Use AtomicInteger for simple atomic counters.', 'Use synchronized or Lock for a multi-step invariant.', 'Use immutable messages and ownership instead of shared mutable state.', 'Use concurrent collections when the collection itself is shared.'] },
      { heading: 'Testing warning', paragraphs: ['A race can disappear when you add logging or a debugger. Stress tests and deliberate scheduling are more useful than one passing run.'] },
    ],
  },
  {
    slug: 'kafka',
    title: 'Kafka',
    category: 'backend-tools',
    summary: 'A distributed append-only log for publishing, storing, and consuming streams of records.',
    level: 'Intermediate',
    minutes: 10,
    tags: ['events', 'partitions', 'consumer groups'],
    takeaway: 'Ordering is guaranteed within a partition, not across an entire topic.',
    diagram: ['Producer', 'Topic', 'Partitions', 'Consumer group', 'Offset'],
    codeLabel: 'KafkaExample.java',
    codeNote: 'The real client needs a broker and the kafka-clients dependency. The future local lab should start both with one click.',
    code: `var producer = new KafkaProducer<String, String>(properties);\n\nproducer.send(new ProducerRecord<>(\n    "orders",\n    "order-42",\n    "created"\n));\n\nproducer.flush();\nproducer.close();`,
    sections: [
      { heading: 'The mental model', paragraphs: ['A topic is split into partitions. Producers append records. Consumers read records and track offsets. A consumer group divides partitions among its members.'] },
      { heading: 'The details that matter', bullets: ['Use a stable key when related events must stay ordered.', 'Consumer groups scale by adding consumers up to the partition count.', 'Retention means records can remain after they were consumed.', 'Retries and duplicate delivery require idempotent consumers.'] },
      { heading: 'Local lab idea', paragraphs: ['A Kafka page should eventually offer Start, Stop, Reset, Produce, and Consume actions against a local broker. The browser should talk to a small local control service, not manage Docker directly.'] },
    ],
  },
  {
    slug: 'redis',
    title: 'Redis',
    category: 'backend-tools',
    summary: 'An in-memory data store useful for caching, counters, sessions, locks, and short-lived data.',
    level: 'Foundations',
    minutes: 8,
    tags: ['cache', 'TTL', 'key-value'],
    takeaway: 'Every Redis value needs an ownership, expiration, and failure story.',
    codeLabel: 'RedisExample.java',
    codeNote: 'This example uses Lettuce and assumes Redis is listening on localhost:6379.',
    code: `RedisClient client = RedisClient.create("redis://localhost:6379");\nvar commands = client.connect().sync();\n\ncommands.setex("user:42:name", 60, "Alice");\nString name = commands.get("user:42:name");\n\nSystem.out.println(name);\nclient.shutdown();`,
    sections: [
      { heading: 'The simple model', paragraphs: ['Redis stores values by key and can expire them automatically. It also supports structures such as lists, sets, sorted sets, and streams.'] },
      { heading: 'Cache decisions', bullets: ['Cache-aside: the application reads the cache first, then loads the source.', 'Choose a TTL that matches how stale the data may be.', 'Decide whether a Redis outage should fail the request or bypass the cache.', 'Prevent many callers from rebuilding the same missing value.'] },
      { heading: 'Local lab idea', paragraphs: ['A local Redis panel can show keys, values, TTLs, and a few safe commands. It should make state visible, then make reset cheap.'] },
    ],
  },
  {
    slug: 'junit',
    title: 'JUnit',
    category: 'testing-engineering',
    summary: 'Write small executable examples that tell you whether a unit behaves as intended.',
    level: 'Foundations',
    minutes: 6,
    tags: ['tests', 'assertions', 'TDD'],
    takeaway: 'A good unit test names one behavior and fails for one useful reason.',
    codeLabel: 'LruCacheTest.java',
    codeNote: 'The example assumes JUnit Jupiter is on the test classpath.',
    code: `import static org.junit.jupiter.api.Assertions.assertEquals;\nimport org.junit.jupiter.api.Test;\n\nclass CalculatorTest {\n    @Test\n    void addsTwoNumbers() {\n        int result = 2 + 3;\n\n        assertEquals(5, result);\n    }\n}`,
    sections: [
      { heading: 'What belongs in a unit test', paragraphs: ['Arrange the input, act once, and assert the observable behavior. Keep the test independent from networks, clocks, and other tests.'] },
      { heading: 'Useful habits', bullets: ['Name the behavior, not the implementation detail.', 'Prefer one reason to fail per test.', 'Use parameterized tests when the same rule has several examples.', 'Test edge cases where the implementation is most likely to lie.'] },
      { heading: 'Test pyramid reminder', paragraphs: ['Keep most tests fast and focused. Use integration tests for real boundaries, not as a substitute for understanding the unit.'] },
    ],
  },
  {
    slug: 'testcontainers',
    title: 'Testcontainers',
    category: 'testing-engineering',
    summary: 'Run real dependencies in disposable containers during tests instead of mocking their behavior into fiction.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['integration tests', 'Docker', 'databases'],
    takeaway: 'Use mocks for your code. Use containers when the behavior belongs to the dependency.',
    codeLabel: 'PostgresTest.java',
    codeNote: 'This needs Docker and the Testcontainers PostgreSQL module.',
    code: `@Testcontainers\nclass PostgresTest {\n    @Container\n    static PostgreSQLContainer<?> postgres =\n        new PostgreSQLContainer<>("postgres:16");\n\n    @Test\n    void databaseIsReachable() {\n        assertTrue(postgres.isRunning());\n    }\n}`,
    sections: [
      { heading: 'What it gives you', paragraphs: ['Your test talks to a real PostgreSQL, Kafka, Redis, or Elasticsearch process started for the test run. This catches protocol and configuration mistakes that mocks cannot.'] },
      { heading: 'Tradeoffs', bullets: ['Tests are slower than pure unit tests.', 'The machine running tests needs Docker.', 'Images should be pinned and cached in CI.', 'Containers need cleanup and sensible resource limits.'] },
      { heading: 'Local lab connection', paragraphs: ['The same service catalog that powers interactive local examples can provide the images and health checks used by integration tests. One definition, two consumers.'] },
    ],
  },
  {
    slug: 'rate-limiter',
    title: 'Rate Limiter',
    category: 'system-design',
    summary: 'Limit how many operations a caller can perform during a period of time.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['tokens', 'traffic', 'distributed systems'],
    takeaway: 'A rate limit is a policy. Choose what happens at the boundary, not just the counter algorithm.',
    diagram: ['Request', 'Check allowance', 'Allow or reject', 'Refill over time'],
    codeLabel: 'TokenBucket.java',
    codeNote: 'This is a teaching model. A distributed limiter needs shared state and a clock strategy.',
    code: `final class TokenBucket {\n    private final int capacity;\n    private int tokens;\n\n    TokenBucket(int capacity) {\n        this.capacity = capacity;\n        this.tokens = capacity;\n    }\n\n    synchronized boolean allow() {\n        if (tokens == 0) return false;\n        tokens--;\n        return true;\n    }\n}`,
    sections: [
      { heading: 'Common algorithms', bullets: ['Fixed window is simple but can burst at window boundaries.', 'Sliding window is smoother but needs more bookkeeping.', 'Token bucket allows bursts up to capacity while controlling average rate.', 'Leaky bucket drains at a steady rate.'] },
      { heading: 'Questions before code', paragraphs: ['Is the limit per user, API key, IP address, or service? Should rejected calls receive Retry-After? Where does state live when there are multiple application instances?'] },
      { heading: 'Production concern', paragraphs: ['A limiter that uses local memory gives each application instance its own limit. That may be correct, or it may be an accidental loophole.'] },
    ],
  },
  {
    slug: 'circuit-breaker',
    title: 'Circuit Breaker',
    category: 'system-design',
    summary: 'Stop calling a failing dependency for a while so the rest of the system can recover.',
    level: 'Intermediate',
    minutes: 8,
    tags: ['resilience', 'timeouts', 'fallbacks'],
    takeaway: 'Retries without timeouts and limits are just a more enthusiastic outage.',
    diagram: ['Closed', 'Failures exceed threshold', 'Open', 'Wait', 'Half-open probe'],
    codeLabel: 'CircuitState.java',
    codeNote: 'A real implementation also needs time windows, metrics, concurrency control, and a timeout.',
    code: `enum State { CLOSED, OPEN, HALF_OPEN }\n\nfinal class Circuit {\n    private State state = State.CLOSED;\n\n    boolean allowsRequest() {\n        return state != State.OPEN;\n    }\n\n    void recordFailure() {\n        state = State.OPEN;\n    }\n\n    void recordSuccess() {\n        state = State.CLOSED;\n    }\n}`,
    sections: [
      { heading: 'The three states', bullets: ['Closed: calls flow normally and failures are counted.', 'Open: calls fail fast without touching the dependency.', 'Half-open: allow a limited probe to see whether recovery happened.'] },
      { heading: 'It is not a retry policy', paragraphs: ['A circuit breaker controls whether a call is attempted. Retry policy controls whether a failed call is attempted again. They should cooperate, not multiply traffic blindly.'] },
      { heading: 'What to measure', bullets: ['Failure rate', 'Open duration', 'Half-open probe results', 'Fallback rate', 'Dependency latency and timeout count'] },
    ],
  },
]

export function subjectsForCategory(categoryId: string): Subject[] {
  return subjects.filter((subject) => subject.category === categoryId)
}

export function findSubject(slug: string): Subject | undefined {
  return subjects.find((subject) => subject.slug === slug)
}
