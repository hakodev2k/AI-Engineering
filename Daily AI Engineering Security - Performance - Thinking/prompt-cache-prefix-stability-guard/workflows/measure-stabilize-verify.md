# Workflow — Measure, Stabilize, Verify

## Trigger
A cache-hit regression, request-builder change, provider migration, or tool/plugin registry change.

## Goal
Improve prompt-cache reuse by removing accidental prefix drift while preserving semantics.

## Inputs
Equivalent baseline/candidate request manifests, provider telemetry, policy.

## Baseline
Record cache-hit/cache-creation tokens, input cost/task, p50/p95 latency, tool count, stable-prefix digest, and quality fixtures.

## Stages
1. **Observe** — capture redacted request manifests and provider usage telemetry.
2. **Measure baseline** — quantify hit/miss tokens and first divergent segment.
3. **Diagnose** — identify non-deterministic arrays, volatile-before-static bytes, or intended semantic changes.
4. **Hypothesize** — predict which host change will make equivalent prefixes byte-stable.
5. **Optimize** — canonicalize only semantically unordered structures and relocate volatile content only when protocol/provider semantics allow.
6. **Measure again** — repeat at least 5 shuffled registration-order fixtures.
7. **Improved?** — if no, revert or form one new hypothesis; maximum 2 optimization attempts.
8. **Verify** — require stable digests, equal tool availability, passing quality fixtures, and improved provider telemetry when supported.

## Tools
`scripts/prefix_stability_guard.py`, request capture, provider usage logs.

## Outputs
Before/after metrics, segment-diff evidence, canonicalization change, verification status.

## Checkpoints
Before optimization, after canonicalization, before release.

## Retry policy
Maximum 2 optimization hypotheses. No infinite cache-tuning loop.

## Stop conditions
Success when stable-prefix fingerprints match equivalent requests and quality does not regress. Stop after 2 failed hypotheses or any correctness regression.

## Failure path
Keep the correctness-preserving baseline and report unresolved divergence. Do not hide the failure by deleting required context.

## Definition of Done
Baseline measured, root cause identified, optimization implemented, provider/host metrics compared, quality fixtures pass, and no required context is lost.