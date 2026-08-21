# Rollback Decision Analysis

## Purpose
Convert validated release evidence into a bounded, explainable recommendation without confusing recommendation with authorization.

## When to use
After `release-evidence.json` passes deterministic validation.

## Inputs
- Valid release evidence
- Release policy
- Known incident context
- Prior reviewer notes, if any

## Preconditions
Evidence validator passed and critical metrics are present.

## Required context
Threshold definitions, observation window, release scope, expected risk, baseline, trend direction, smoke-test status, and possible external causes.

## Allowed tools
Read-only evidence inspection, calculators, repository/deployment metadata, and `scripts/evaluate-release-gate.py`.

## Constraints
- Never approve or execute rollback.
- Never suppress a threshold breach to avoid escalation.
- Never mark a release healthy while a critical blocking condition is unresolved.

## Process
1. Run deterministic gate evaluation.
2. List threshold breaches and non-breaches separately.
3. Identify whether breaches are sustained, worsening, recovering, or single-sample anomalies.
4. Check whether smoke/integration failures align with the degraded component.
5. Check business and data-integrity signals when configured.
6. Identify plausible competing causes and evidence for/against each.
7. Recommend exactly one of: `healthy`, `observe`, `rollback-recommended`, `blocked`.
8. For `observe`, state the next decision timestamp and evidence required; do not extend beyond policy maximum observation window.
9. For `rollback-recommended`, state which policy conditions triggered it and affected scope.
10. Record unresolved risks and hand off to Rollback Reviewer.

## Expected output
A recommendation containing status, evidence references, threshold breaches, alternatives considered, unresolved risks, and next action.

## Verification
Recommendation status must not contradict deterministic blocking conditions. Any `observe` recommendation must remain within the policy observation window.

## Failure handling
Allow at most two evidence/reasoning revisions after reviewer feedback. If disagreement persists, escalate to the human release owner.

## Stop conditions
Stop if evidence changes during review, policy changes mid-decision, required data becomes stale, or production mutation would be needed to continue analysis.