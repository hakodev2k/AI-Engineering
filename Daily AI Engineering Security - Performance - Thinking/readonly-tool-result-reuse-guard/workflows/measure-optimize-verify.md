# Workflow: Measure → Optimize → Verify
## Trigger
Token/context budget breach or repeated read-only payloads.
## Goal
Reduce repeated context without stale reuse.
## Inputs
Trace JSONL, baseline metrics, tool semantics, policy.
## Baseline
Record tokens/task, bytes/task, compactions, latency, quality.
## Stages
1. Observe.
2. Measure redundancy.
3. Diagnose dependency identity.
4. Form hypothesis.
5. Configure eligibility/invalidation.
6. Run tests.
7. Re-run workload.
8. Compare and independently verify.
## Checkpoints
Baseline, exclusions, mutation test, final comparison.
## Metrics
Tokens, bytes, hit rate, compactions, latency, regression.
## Retry policy
At most 2 policy revisions.
## Stop conditions
Stale result, missing required context, secret exposure, exhausted retries.
## Failure path
Disable reuse for affected tool.
## Verification
Independent reviewer confirms invalidation evidence.
## Definition of Done
Measured savings, no quality regression, tests pass, fallback valid.
