# Workflow — Verify Control-Plane Mutation

## Trigger
A task/session control-plane mutation is requested.

## Goal
Prove the intended state transition before reporting completion or starting dependent cleanup.

## Inputs
Mutation ID/type, expected postconditions, authoritative observation sources, consistency deadline.

## Baseline
Measure current mutation success rate, false-success incidents, repeated retries, and verification latency.

## Stages
1. **Observe pre-state:** capture authoritative fields and resource identity.
2. **Declare postconditions:** define required observable facts before mutation execution.
3. **Execute externally:** the calling system performs the mutation; this package does not.
4. **Collect result:** store RPC/UI response as one evidence item.
5. **Observe post-state:** read authoritative sources.
6. **Verify:** run deterministic postcondition checker.
7. **Bounded consistency loop:** if incomplete and before deadline, observe at most two additional times with backoff.
8. **Independent review:** verifier checks evidence provenance and classification.
9. **Gate dependents:** only verified-success may unlock dependent destructive actions.

## Checkpoints
After pre-state, after mutation response, before each re-observation, before dependent cleanup.

## Metrics
Verified-success/failure/indeterminate rates, verification p95, identical retry count, false-success count, blocked unsafe dependents.

## Retry policy
Observation: maximum 3 total checks. Mutation retry: none automatically. A mutation may be retried only by the caller after new evidence or a materially different repair.

## Failure path
Persist evidence, classify failure/indeterminate, block dependents, and escalate with violated postconditions and source health.

## Stop conditions
Success/failure verified, consistency deadline reached, or authoritative observation source unavailable.

## Definition of Done
Pre-state and postconditions exist, post-state is observed, deterministic classification exists, independent verification agrees, and no destructive dependent action ran before verified-success.
