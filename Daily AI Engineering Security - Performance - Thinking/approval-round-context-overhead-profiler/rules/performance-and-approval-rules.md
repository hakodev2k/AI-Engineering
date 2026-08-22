# Performance and Approval Rules

- A baseline MUST exist before any optimization claim.
- Every provider invocation MUST carry `turn_id`, `approval_round`, provider name, duration, and input fingerprint.
- Required human approval MUST NOT be removed, auto-granted, or bypassed as a performance optimization.
- Provider results MUST NOT be reused across changed input fingerprints.
- Mutable or nondeterministic providers MUST NOT be cached unless they expose an explicit safe reuse contract.
- Read-only deterministic providers SHOULD use logical-turn scoped reuse when measurements prove repeated equivalent work.
- Benchmarks MUST compare equivalent fixtures and report p50/p95 latency, provider calls, and timeout rate.
- An optimization MUST be rejected if correctness or approval behavior changes.
- Optimization loops MUST stop after two failed hypotheses unless a human explicitly authorizes further work.
- Improvement MUST NOT be reported as Verified until regression fixtures pass.
