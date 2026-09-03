# Deployment and Rollback Rules

## Purpose
Make model-serving releases controlled, observable, and reversible.

## Scope
Applies to model, runtime, configuration, container, kernel, driver, and routing releases.

## MUST
- Define deployment health criteria and rollback triggers before production rollout.
- Preserve the previous known-good model and serving configuration for rapid restoration.
- Roll out high-impact changes progressively unless an approved emergency procedure applies.
- Verify readiness, correctness, latency, errors, and resource behavior after each rollout stage.
- Require human approval before production deployment or breaking serving-contract changes.

## MUST NOT
- Perform irreversible production changes without a tested recovery path.
- Combine unrelated high-risk model, runtime, and infrastructure changes when doing so prevents fault isolation.
- Continue rollout after predefined abort criteria are breached.

## SHOULD
- Automate safe rollback while keeping execution authority aligned with project policy.
- Record release evidence and decision points.

## Exceptions
Emergency releases require incident authority, bounded scope, documented risk, and immediate post-change verification.

## Verification
Inspect deployment plans, approval records, canary results, health gates, rollback tests, and production telemetry.