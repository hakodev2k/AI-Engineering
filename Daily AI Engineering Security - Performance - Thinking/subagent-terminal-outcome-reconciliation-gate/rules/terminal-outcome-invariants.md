# Rules — Terminal Outcome Invariants

- A parent run **MUST NOT** report `verified_success` solely because the parent process exited successfully or the model said it was done.
- Every required delegated operation **MUST** appear in an explicit expected-child set before terminal success is accepted.
- Every required child **MUST** have start evidence when start evidence is required by policy.
- Every required child **MUST** have a terminal receipt before `verified_success`.
- Required acceptance evidence **MUST** pass independently of child self-report before `verified_success`.
- A required child that never started **MUST** block success.
- A required child still running **MUST** block terminal success and trigger bounded reconciliation.
- Cancellation or interruption **MUST NOT** erase known child artifacts, receipts, or committed-effect evidence.
- An interrupted child with unknown commit state **MUST NOT** be automatically rerun.
- An interrupted child with useful committed work but incomplete acceptance **SHOULD** be classified `partial` or `reconcile`, not blindly `failed`.
- Explicit terminal failure of a required child **MUST** produce failure unless a separately verified equivalent fallback satisfies the same acceptance criteria.
- Parent and child lifecycle status **MUST** be stored separately from objective acceptance status.
- Model narration **MUST NOT** be used as terminal evidence when registry, artifact, test, or receipt evidence is available.
- Reconciliation loops **MUST** have a configured maximum and **MUST NOT** run indefinitely.
- Missing lifecycle infrastructure **MUST** fail closed for terminal success.
- A verifier that implemented the work **MUST NOT** be the only verifier for high-impact terminal outcomes.
- Evidence records **SHOULD** contain facts, source references, statuses, and verification results without requesting or exposing hidden chain-of-thought.
