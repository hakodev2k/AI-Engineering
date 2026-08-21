# Release Strategies

## Purpose
Choose and execute deployment strategies that control production risk and recovery time.

## When to use
Use for designing rolling, blue-green, canary, feature-flagged, or progressive delivery.

## Inputs
Service architecture, statefulness, traffic controls, SLOs, rollback constraints, migration behavior.

## Context to inspect
Current deployment mechanism, health signals, database compatibility, session state, traffic routing, feature flags.

## Core knowledge
Deployment strategy must match failure cost, observability, state compatibility, and rollback semantics. Progressive delivery is only safe when health signals are trustworthy.

## Procedure
1. Classify workload and state dependencies.
2. Define success/failure metrics.
3. Validate backward/forward compatibility.
4. Select rollout strategy.
5. Define traffic increments and dwell time.
6. Automate health evaluation where practical.
7. Define rollback/roll-forward path.
8. Coordinate schema changes safely.
9. Test strategy in lower environments.
10. Observe after full promotion.

## Decision points
Use canary for high-risk changes with measurable signals; blue-green for fast switchback and duplicable capacity; rolling for routine low-risk compatible changes.

## Common failure patterns
Canary without metrics, rollback incompatible with DB changes, hidden state, instant 100% rollout, manual traffic changes without evidence.

## Verification
A release can fail safely, traffic can revert, and data/application versions remain compatible.

## Expected output
Documented rollout and rollback procedure tied to objective health criteria.

## Stop conditions
Stop when no safe rollback/roll-forward exists for a high-risk production change.