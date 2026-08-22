# Memory and Resource Rules
## Purpose
Prevent leaks, crashes, excessive memory pressure, and native-resource exhaustion.
## Scope
Images, streams, subscriptions, observers, native handles, caches, and object lifetimes.
## MUST
- Resources requiring explicit release MUST have deterministic ownership and cleanup.
- Event/listener subscriptions MUST not outlive their intended owner.
- Large media MUST be decoded and cached at sizes appropriate to display needs.
## MUST NOT
- Unbounded caches or retained screen graphs MUST NOT accumulate across navigation.
- Memory warnings MUST NOT be ignored for applications with large working sets.
## SHOULD
- Memory-sensitive features SHOULD define budgets and eviction behavior.
## Exceptions
Intentional process-lifetime singletons are acceptable when bounded and justified.
## Verification
Profile repeated navigation, image-heavy flows, background transitions, low-memory conditions, and native allocation growth.