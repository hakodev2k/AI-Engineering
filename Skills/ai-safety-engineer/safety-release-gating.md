# Safety Release Gating

## Purpose
Make release decisions using explicit safety evidence, thresholds, ownership, and rollback readiness.

## When to use
Use before production launch, major capability expansion, model migration, or sensitive feature enablement.

## Inputs
Acceptance criteria, eval results, open risks, incidents, change list, monitoring, rollback plan.

## Context to inspect
Unresolved defects, waivers, deployment scope, canary controls, dependencies, and operational staffing.

## Core knowledge
Release gates should be predetermined, evidence-based, and severity-aware. Waivers must not silently become permanent exceptions.

## Procedure
1. Confirm the candidate configuration is immutable and identified.
2. Collect required safety evidence.
3. Evaluate each release criterion independently.
4. Review unresolved high-severity findings.
5. Verify monitoring, kill switches, and rollback.
6. Record waivers with owner, rationale, expiry, and compensating controls.
7. Decide release, limited release, or block.
8. For limited release, define exposure caps and expansion criteria.
9. Archive the decision package.

## Decision points
Choose limited rollout when uncertainty is material but bounded and observable. Block when severe risk lacks effective mitigation.

## Common failure patterns
Moving thresholds after results; verbal waivers; gating on average scores only; no rollback rehearsal.

## Verification
Independently confirm evidence corresponds to the exact release artifact and all blocking criteria pass.

## Expected output
A signed-off release decision with evidence, waivers, rollout limits, and rollback thresholds.

## Stop conditions
Block release on failed critical gates, unowned residual risk, or nonfunctional containment mechanisms.