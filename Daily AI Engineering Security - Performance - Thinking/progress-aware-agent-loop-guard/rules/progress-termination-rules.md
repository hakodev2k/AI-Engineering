# Rules: Progress-Aware Termination

1. A production agent MUST have a deterministic hard ceiling for total steps, wall time, or equivalent resource budget.
2. A progress guard MUST evaluate canonical tool/action content, not opaque call IDs alone.
3. The guard MUST distinguish exact-repeat streaks from short cycles and state stagnation.
4. A repeated call MUST NOT be classified as no-progress solely because the tool name repeats; arguments, outcome, and state novelty MUST be considered.
5. Side-effecting tools MUST NOT be automatically retried after a no-progress signal unless idempotency or a verified state transition proves the retry safe.
6. Runtime-generated replay MUST be recorded separately from model-emitted repeated calls when the runtime exposes that distinction.
7. A no-progress stop MUST NOT be reported as task success.
8. Threshold changes MUST be evaluated against a labeled loop fixture set and successful long-run controls.
9. A performance improvement MUST NOT be claimed without before/after measurements on the same representative workload.
10. The team MUST record calls/task, tokens/task, latency, task success, and false-positive termination rate when those metrics are available.
11. The guard MUST preserve existing security, authorization, and human-approval boundaries.
12. Recovery loops MUST be bounded to at most two tuning attempts per rollout unless a human explicitly approves a different limit.
13. The verifier SHOULD be independent of the implementation agent for production changes.
14. If required trace evidence is absent, the result MUST be `insufficient_evidence`, not a guessed root cause.
