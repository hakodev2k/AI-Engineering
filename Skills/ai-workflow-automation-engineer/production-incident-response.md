# Production Incident Response

## Purpose
Diagnose and stabilize failed or unsafe production automations while preserving evidence, limiting business impact, and restoring processing deliberately.

## When to use
Use for widespread workflow failures, stuck backlogs, duplicate side effects, corrupted integrations, credential outages, abnormal AI behavior, or dependency incidents.

## Inputs
Incident symptoms, alerts, logs, traces, metrics, recent changes, execution IDs, dependency status, runbooks, and business-impact information.

## Preconditions
Establish an incident owner and protect sensitive production access.

## Context to inspect
Inspect failure onset, affected workflows/tenants, recent deployments, queue age, dependency health, retry rates, side-effect history, credentials, and active automation controls.

## Core knowledge
Incident work prioritizes containment and evidence over speculative fixes. Retries can worsen incidents. Restoring technical execution is not enough when partial or duplicate business effects need reconciliation.

## Procedure
1. Confirm the incident and establish severity based on business impact.
2. Define the affected scope and start time.
3. Preserve logs, execution IDs, and relevant state.
4. Check recent changes and dependency status without assuming causality.
5. Contain unsafe side effects by pausing triggers, consumers, or specific actions when justified.
6. Prevent uncontrolled retry amplification.
7. Form hypotheses from telemetry and test the least risky ones.
8. Apply a reversible mitigation when possible.
9. Verify system health and business-state consistency separately.
10. Reconcile failed, partial, or duplicated transactions.
11. Resume processing gradually and monitor backlog recovery.
12. Record root cause, contributing factors, detection gaps, and corrective actions.

## Decision points
Pause processing when continuing can multiply harm. Keep ingestion active but defer side effects when durable buffering is safe. Roll back only when business state and compatibility permit it.

## Common failure patterns
Blindly rerunning failures, deleting stuck executions, changing multiple variables at once, declaring recovery before reconciliation, and losing evidence during cleanup.

## Verification
Confirm error rate, backlog, latency, dependency health, and representative business records are normal; verify no unresolved partial effects remain.

## Expected output
A stabilized service, reconciled business state, incident timeline, root cause, and prioritized corrective actions.

## Stop conditions
Escalate when production permissions are insufficient, financial/security impact is suspected, data integrity cannot be established, or mitigation could create additional irreversible effects.