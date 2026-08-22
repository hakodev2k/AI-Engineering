# Side Effect Rules
## Purpose
Control browser and framework side effects so lifecycle behavior remains correct.
## Scope
Subscriptions, timers, observers, browser APIs, synchronization effects, and cleanup.
## MUST
- Every persistent subscription, timer, observer, or resource MUST have lifecycle-safe cleanup.
- Effect dependencies MUST reflect the values actually used under the framework's semantics.
- Effects that issue asynchronous work MUST prevent obsolete results from corrupting current state.
- External synchronization MUST be idempotent or explicitly guarded when lifecycle replay is possible.
## MUST NOT
- Effects MUST NOT be used to derive state that can be computed during rendering.
- Cleanup warnings or dependency checks MUST NOT be disabled merely to silence defects.
## SHOULD
- Encapsulate complex effects behind tested reusable abstractions.
## Exceptions
Deliberate dependency deviations require documented invariant and review.
## Verification
Static analysis, strict/development lifecycle testing, cancellation tests, and leak inspection.