# Production Debugging and Root-Cause Analysis

## Purpose
Investigate Salesforce production defects systematically across Apex, Flow, data, permissions, integrations, limits, and asynchronous execution while minimizing further impact.

## When to use
Use for incidents, intermittent failures, unexpected automation, limit exceptions, authorization defects, and integration regressions.

## Inputs
Incident timeline, affected users/records, error messages, logs, deployment history, telemetry, job status, integration evidence.

## Context to inspect
Recent metadata changes, Flow versions, Apex logs, async jobs, permission changes, record history, external API logs, platform status, data skew.

## Core knowledge
Symptoms often cross automation layers. Debugging must reconstruct the actual transaction and distinguish correlation from causation. Production data access should be minimized and auditable.

## Procedure
1. Define impact, start time, affected scope, and current mitigation.
2. Correlate failures with deployments, config, data, and external changes.
3. Reproduce safely with equivalent permissions and data shape.
4. Trace order of execution across Flow, triggers, validation, DML, and async work.
5. Inspect limits and exception chains.
6. Compare affected and unaffected records/users.
7. Form one testable hypothesis at a time.
8. Apply the smallest safe mitigation.
9. Verify recovery with telemetry and user-visible behavior.
10. Record root cause and regression protection.

## Decision points
Rollback when a recent reversible release is strongly implicated and rollback risk is lower than forward-fix risk. Prefer feature disablement when diagnosis is incomplete but impact is ongoing.

## Common failure patterns
Changing multiple variables at once, relying on admin reproduction, enabling excessive logging, editing production data without evidence, and stopping at the first exception rather than the originating condition.

## Verification
Confirm incident symptoms cease, affected operations recover, no new regressions appear, and a test or guard prevents recurrence.

## Expected output
Evidence-backed root cause, mitigation, permanent fix, verification, and follow-up risks.

## Stop conditions
Escalate when investigation requires unauthorized production access, destructive correction, vendor intervention, or unresolved security exposure.