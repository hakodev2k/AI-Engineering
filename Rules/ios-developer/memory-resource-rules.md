# Memory and Resource Rules

## Purpose
Prevent leaks, premature deallocation, resource exhaustion, and lifecycle-dependent crashes.

## Scope
ARC, closures, delegates, images, files, sockets, observers, timers, caches, and system resources.

## MUST
- Ownership relationships MUST be intentional for closures, delegates, observers, tasks, and callbacks.
- Long-lived resources MUST have explicit release or invalidation behavior.
- Large images and data MUST be decoded/loaded with memory impact appropriate to device constraints.
- Caches MUST have bounded growth or rely on system-managed eviction.
- Resource cleanup MUST occur on cancellation and failure paths as well as success paths.

## MUST NOT
- MUST NOT rely on deinit timing as the only correctness mechanism for critical cleanup.
- MUST NOT capture self strongly in long-lived closures without reviewing the ownership cycle.
- MUST NOT retain entire payloads when streaming or incremental processing satisfies the requirement.

## SHOULD
- Prefer scoped resource APIs and weak ownership where semantics require non-ownership.
- Test repeated navigation and long sessions for stable memory behavior.

## Exceptions
Intentional retention requires documented lifetime, upper bound, and evidence that memory pressure is acceptable.

## Verification
Use Instruments Leaks/Allocations, memory graph debugger, repeated lifecycle tests, memory-warning scenarios, and code review of closures and resource handles.