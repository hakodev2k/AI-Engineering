# Rules: Resume Contract

- Every resumable task **MUST** declare required input dependencies.
- Each dependency **MUST** be labeled `durable`, `reconstructable`, or `runtime-only`.
- Automatic resume **MUST NOT** proceed when a required runtime-only input is unavailable.
- Reconstructed inputs **MUST** match the original logical-input fingerprint or resume **MUST** be blocked.
- Completed task/result evidence **MUST** be checked before re-executing work.
- Side-effecting completed work **MUST NOT** be replayed without an explicit idempotency/replay guarantee.
- Nested graph/subgraph execution **MUST** be covered by resume regression tests when checkpoint ownership differs from standalone execution.
- Recovery loops **MUST** be bounded by `config/policy.json`.
- A failed equivalence test **MUST NOT** be hidden by relaxing expected state/output assertions.
- Operators **SHOULD** prefer restart from a known-safe boundary over fabricating missing task inputs.
