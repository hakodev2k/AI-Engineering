# Performance and Resource Rules

## Purpose
Control browser automation cost and resource use without compromising correctness or evidence quality.

## Scope
Applies to browser processes, memory, CPU, network use, videos, traces, screenshots, suite duration, concurrency, and performance claims.

## MUST
- Performance improvements to automation MUST be supported by before-and-after measurements on representative workloads.
- Resource-intensive artifacts such as video or full tracing MUST have a policy that balances diagnostic value, storage, and runtime cost.
- Browser and worker processes MUST be cleaned up reliably after success, failure, cancellation, and timeout.
- Suite performance regressions that materially affect feedback time or infrastructure stability MUST be investigated using measured stage-level evidence.
- Resource limits MUST fail observably rather than silently dropping verification work.

## MUST NOT
- Assertions, isolation, or security checks MUST NOT be removed solely to achieve a faster runtime without an explicit risk decision.
- Concurrency MUST NOT be increased until the application or runner becomes unstable and then described as an optimization.
- Performance claims MUST NOT be based on a single unrepresentative run.

## SHOULD
- Measure setup, navigation, interaction, waiting, artifact capture, and teardown separately when diagnosing slow suites.
- Reuse expensive immutable infrastructure SHOULD be considered before reusing mutable scenario state.

## Exceptions
Reduced diagnostics or narrower execution may be appropriate for high-frequency feedback when equivalent deeper coverage runs elsewhere; document the coverage boundary.

## Verification
Collect timing and resource metrics, compare distributions before and after changes, inspect leaked processes, test resource-limit behavior, and verify optimized suites detect seeded failures at the same required level.