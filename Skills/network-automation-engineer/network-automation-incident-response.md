# Network Automation Incident Response

## Purpose
Respond to incidents caused or amplified by automation while preventing further mutations and preserving evidence.

## When to use
Use for widespread bad changes, automation loops, controller/API faults, partial deployments, credential compromise, or unexplained fleet drift.

## Inputs
Execution history, target scope, logs, diffs, source-of-truth changes, telemetry, credentials, and rollback artifacts.

## Context to inspect
Active jobs, queues, schedulers, pipelines, closed-loop systems, API tokens, device state, and recent commits.

## Core knowledge
First priority is containment: stop unsafe mutation without destroying the ability to diagnose. Rollback is not automatically safe when network state evolved after the original change.

## Procedure
1. Freeze or pause mutating automation at the narrowest effective scope.
2. Preserve logs, workflow state, commits, and diffs.
3. Determine affected devices/services and authoritative intended state.
4. Identify whether jobs are still running or retrying.
5. Revoke compromised automation identity if relevant.
6. Stabilize network with reversible actions.
7. Validate rollback candidate against current state.
8. Recover progressively with postchecks.
9. Reconcile source of truth and device state.
10. Fix triggering defect and add regression/safety tests before re-enable.

## Decision points
Pause globally only when systemic risk exceeds outage from halted automation. Roll back only after current-state validation; sometimes forward-fix is safer.

## Common failure patterns
Killing jobs without state capture, automatic rollback over later valid changes, leaving retry queues active, and re-enabling before regression proof.

## Verification
Confirm no uncontrolled mutations remain, network SLOs recover, intended/actual state reconciles, and the defect is reproducible then prevented.

## Expected output
Containment record, scope, recovery evidence, root cause, and hardened re-enable criteria.

## Stop conditions
Escalate immediately for credential compromise, unknown partial state, or automation continuing to mutate despite pause controls.