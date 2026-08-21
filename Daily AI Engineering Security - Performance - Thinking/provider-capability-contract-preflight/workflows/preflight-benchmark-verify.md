# Workflow: Preflight → Benchmark → Verify

## Trigger
New provider/model/API version, client upgrade, or first use of an advanced request lane.

## Goal
Prevent deterministic provider incompatibility from entering retry loops or blocking a long-running task after work has begun.

## Inputs
Provider configuration, requested feature contract, serializer output, baseline failure/retry metrics.

## Baseline
Capture current startup latency, request count to first successful inference, deterministic 4xx count, retry count, and review-lane success rate.

## Stages
1. Observe the current effective request shapes.
2. Measure baseline with non-destructive canaries.
3. Diagnose failing field/feature using response evidence and one-variable A/B when safe.
4. Form a capability hypothesis.
5. Generate a provider-specific safe profile.
6. Run primary and review canaries.
7. Measure again.
8. Independent verifier checks semantics and request shape.

## Responsible agent
Capability analyst proposes the profile; Provider Compatibility Verifier performs final verification.

## Tools
Request serializer, `scripts/capability_gate.py`, redacted trace capture, HTTP canary client.

## Outputs
Capability matrix JSON, before/after metrics, selected profile, verification report.

## Checkpoints
No unsupported feature at dispatch; no approval semantic downgrade; deterministic 4xx produces zero unchanged retries.

## Metrics
Pre-inference 4xx rate, unchanged retry count, startup latency, review success rate, request count to useful response.

## Retry policy
Transient errors: maximum two retries. Deterministic incompatibility: zero unchanged retries; at most two distinct remediation hypotheses.

## Stop conditions
Required capability remains unsupported after two hypotheses; auth is uncertain; fallback weakens security/correctness; verifier returns BLOCK.

## Failure path
Emit the unsupported capability and evidence, preserve the original provider config, and block task execution instead of silently stripping critical behavior.

## Verification
Compare baseline and optimized metrics and validate request fixtures against the selected allowlist.

## Definition of Done
Capability evidence exists; safe profile is explicit; canaries pass; deterministic retries are eliminated; required approval/tool semantics remain intact; independent verifier returns PASS.