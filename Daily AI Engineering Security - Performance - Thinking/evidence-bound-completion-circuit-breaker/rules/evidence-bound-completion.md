# Evidence-Bound Completion Rules

1. Every long-running task **MUST** define an observable target and required readiness before reporting completion.
2. Claims of `validated-target`, `released`, or `accepted` **MUST** cite fresh evidence from that exact target.
3. Component tests **MUST NOT** silently satisfy target-level acceptance unless the contract explicitly defines them as sufficient.
4. Evidence **MUST** record criterion, target, timestamp, outcome, and provenance.
5. Failed or missing criteria **MUST** remain visible as blockers.
6. A user correction **MUST** trigger fresh state retrieval before status is reasserted.
7. The agent **MUST NOT** claim a higher readiness state than the deterministic guard permits.
8. Loops **MUST** have maximum model/tool-call, elapsed-time, unchanged-evidence, and repeated-failure bounds.
9. Exceeding a bound **MUST** trigger replan or stop; limits **MUST NOT** be repeatedly raised to hide non-progress.
10. High-impact or irreversible verification **MUST** require explicit human approval.
11. The implementing agent **MUST NOT** be the sole verifier for high-risk changes.
12. Final status **SHOULD** distinguish Implemented, Measured, and Verified.