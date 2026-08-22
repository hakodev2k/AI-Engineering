# Memory and Resource Rules
## Purpose
Prevent long-lived browser sessions from degrading through leaked resources or unbounded retained data.
## Scope
Event listeners, subscriptions, timers, object URLs, workers, caches, large collections, and detached DOM.
## MUST
- Resources created by a component or feature MUST have a defined release lifecycle when the platform does not release them automatically.
- Long-lived collections and client caches MUST have bounds or eviction behavior when cardinality can grow.
- Large files, media, and object URLs MUST be released when no longer needed.
- Suspected memory regressions MUST be investigated with heap/runtime evidence before speculative rewrites.
## MUST NOT
- Global listeners or subscriptions MUST NOT accumulate across navigation or remounts.
- Memory-leak fixes MUST NOT rely solely on manual garbage-collection observations.
## SHOULD
- Profile representative long-running workflows when the application is expected to remain open for extended periods.
## Exceptions
Intentionally retained application-lifetime resources require bounded size and ownership.
## Verification
Heap snapshots, allocation profiles, repeated mount/navigation tests, listener inspection, and long-session monitoring.