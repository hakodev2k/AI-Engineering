# Workflow — Assess and Enforce MCP Cache Trust

## Trigger
New MCP 2026-07-28 caching support, shared-cache rollout, server onboarding, policy change, or poisoning alert.

## Goal
Preserve safe caching while preventing untrusted public-scope claims from crossing authorization boundaries.

## Inputs
Traffic sample, cache topology, server registry, auth partition design, policy, attack fixtures.

## Baseline
Measure current key shape, scope decisions, hit ratio, p50/p95 admission latency, public/private entry counts, and whether cross-context retrieval is possible.

## Stages
1. **Observe** — inventory cacheable MCP methods and model-visible fields. Owner: platform engineer.
2. **Measure** — capture baseline with sanitized metadata. Owner: benchmark operator.
3. **Diagnose** — map trust boundaries and server-authored fields. Owner: security reviewer.
4. **Hypothesize** — define which server/method pairs can safely be public and why.
5. **Implement** — install deterministic admission gate and provenance-bound keying.
6. **Measure again** — replay normal and malicious fixtures.
7. **Verify** — independent reviewer confirms cross-context attack fails and legitimate approved public caching still works.

## Tools
Reference script, cache logs with secret redaction, test runner, configuration diff.

## Outputs
Baseline report, effective policy, admission evidence, before/after metrics, verification record.

## Checkpoints
- CP1: all auth boundaries identified.
- CP2: public allowlist has explicit rationale.
- CP3: no unknown identity can enter shared cache.
- CP4: attack corpus passes.

## Retry policy
At most 2 diagnose/change/retest cycles. Each retry MUST change a hypothesis, policy, or implementation; identical retries are forbidden.

## Stop conditions
Stop and escalate on unresolved identity, any successful cross-context poisoning, secret exposure, or exhausted retries.

## Failure path
Disable shared caching for affected methods; retain private/no-store behavior; preserve evidence; require human security approval before re-enabling.

## Verification
Test public approved, public untrusted, private same-context, private cross-context, expired, notification-invalidated, digest-mismatch, and unknown-server cases.

## Definition of Done
Baseline and after metrics exist, guard is active on read/write paths, attack success rate is zero, no required context is removed, independent review passes.
