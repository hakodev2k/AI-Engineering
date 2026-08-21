# Workflow: Diagnose and Deploy Quota Admission Breaker

## Trigger
Repeated model/subagent dispatches occur after quota/rate-limit failures, or telemetry shows significant post-exhaustion provider traffic.

## Goal
Prevent provably doomed same-resource provider calls while preserving unrelated work and safe recovery.

## Inputs
Failure/event traces, provider resource metadata, baseline call counts, current retry behavior, admission policy.

## Baseline
Capture at least: first confirmed exhaustion timestamp, same-resource calls after it, unrelated calls, total provider calls, task latency, quota/cost after first failure, and retry/follow-up count.

## Context
Use `skills/quota-admission-analysis.md`, `rules/provider-resource-admission.md`, and `scripts/quota_gate.py`.

## Stages
1. **Observe** — Evidence analyst classifies failures and identifies authoritative resource scope.
2. **Measure baseline** — Count post-exhaustion same-resource dispatches and unrelated-work behavior.
3. **Diagnose** — Determine where typed failure or resource scope is lost before orchestration.
4. **Form hypothesis** — Define the smallest resource key and state transition that can stop duplicate calls.
5. **Implement** — Add pre-dispatch admission plus generation-aware state transition; do not change global cancellation.
6. **Measure again** — Replay the same workload.
7. **Evaluate** — If same-resource calls remain or unrelated work is blocked, re-evaluate once.
8. **Verify** — Independent verifier runs mixed-resource, ambiguous-429, race, reset, and local-tool scenarios.

## Responsible agent
Evidence analyst for stages 1–3; implementation owner for stages 4–6; independent verifier for stage 8.

## Tools
Structured logs, deterministic gate script, unit/integration tests, provider stubs/fakes. Real quota exhaustion is not required for regression tests.

## Outputs
Baseline report, resource-key definition, admission policy, before/after metrics, failure cases, verification result.

## Checkpoints
- C1: typed exhaustion evidence exists.
- C2: resource key is authoritative enough for shared blocking.
- C3: breaker is written before orchestration redispatch.
- C4: unrelated resource/local work remains allowed.
- C5: recovery is generation-safe.

## Metrics
Same-resource calls after trip (target 0), avoided calls, false-positive denial count (target 0 in fixtures), half-open probes (target <=1/generation), admission p95 latency, task completion of unaffected work.

## Retry policy
At most 2 implementation iterations. A failed half-open probe receives no immediate second probe in the same generation.

## Stop conditions
Stop on ambiguous scope, false-positive cross-resource blocking, two failed implementation iterations, or missing typed evidence.

## Failure path
Revert shared blocking to request-local failure, keep evidence, surface the limitation, and do not weaken classification requirements.

## Verification
Run `python scripts/quota_gate.py verify tests/fixtures.json` or equivalent integration fixtures. All required scenarios must pass.

## Definition of Done
Implemented: admission state and pre-dispatch gate exist. Measured: before/after call counts captured. Verified: zero same-resource post-trip calls in tests, unrelated work proceeds, ambiguous status does not trip shared state, recovery probe is bounded.