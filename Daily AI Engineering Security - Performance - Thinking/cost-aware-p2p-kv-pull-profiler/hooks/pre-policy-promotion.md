# Hook: Pre-Policy Promotion

## Trigger
Before a new P2P KV pull threshold/cost policy is promoted from staging to production.

## Preconditions
Baseline and candidate benchmark artifacts exist for the same deployment signature and workload definition.

## Action
1. Run `python scripts/kv_cost_profiler.py <samples.csv> --min-samples <policy minimum>`.
2. Confirm every promoted segment is `measured`, not `insufficient_evidence`.
3. Compare baseline and candidate TTFT p95, throughput and failed-pull rate against `config/policy.json`.
4. Require Benchmark Verifier approval.

## Expected result
Promotion proceeds only when cost models are measured and configured regression limits are satisfied.

## Failure behavior
Block promotion and invoke `workflows/failure-recovery.md`; preserve baseline policy.

## Blocks completion
Yes.
