# Workflow: Measure → Diagnose → Enforce

## Trigger
Security advisory, framework upgrade, new resolver/tool registry, or observed unadvertised call.

## Goal
Prove dispatch authority never exceeds the effective request authorization.

## Inputs
Trace corpus, request tool sets, resolver settings, policy, dispatch implementations.

## Baseline
Run known-good calls plus deliberately absent tool names before modifying enforcement. Record whether each call reaches execution.

## Context
Separate model selection/disclosure from dispatcher authorization. Include streaming, retries, resume and custom managers.

## Stages
1. **Observe** — inventory dispatch paths and capture sanitized events.
2. **Measure baseline** — count mismatches and fallback dispatches.
3. **Diagnose** — classify widening as resolver fallback, stale state, wrapper bypass, dynamic-list drift, or policy defect.
4. **Form hypothesis** — state the smallest enforceable change and expected metric effect.
5. **Implement** — enforce request allow-set at the final pre-side-effect point.
6. **Measure again** — replay identical corpus.
7. **Verify** — independent Security Verifier runs adversarial cases.

## Responsible agent
Implementation Agent owns stage 5. Security Verifier owns stage 7 and must be different for high-risk changes.

## Tools
Framework logs/traces, unit/integration tests, package checker, version/config inspection.

## Outputs
Baseline table, root-cause statement, implementation evidence, after-table, independent verdict.

## Checkpoints
After baseline; after root-cause classification; before enabling global exceptions; before completion.

## Metrics
Successful unauthorized dispatches (target 0), blocked mismatches, false positives, path coverage, fallback frequency.

## Retry policy
At most 2 diagnose/implement cycles. Each retry must include new evidence or a changed hypothesis.

## Stop conditions
Success: zero unauthorized executions and verifier passes. Failure: unknown path, missing identity/policy state, or unresolved bypass after two retries.

## Failure path
Fail closed, disable affected path where possible, preserve evidence, escalate. Do not broaden tools to restore functionality.

## Verification
Replay the same corpus plus one resolver-only tool absent from the request.

## Definition of Done
Baseline recorded; limitation identified; enforcement implemented; tests pass; after-metrics collected; independent verification complete; residual risk documented.