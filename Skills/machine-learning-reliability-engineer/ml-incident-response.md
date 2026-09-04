# ML Incident Response

## Purpose
Provide a disciplined response process for production incidents where model behavior, data, features, serving infrastructure, or retraining systems threaten ML reliability.

## When to use
Use when ML SLOs breach, prediction quality suddenly degrades, data contracts fail, serving errors increase, or a release causes abnormal outcomes.

## Inputs
- Incident description and timeline
- Model/version metadata
- Logs, metrics, traces, and alerts
- Data and feature telemetry
- Recent deployments and pipeline changes
- Runbooks and rollback options

## Context to inspect
Inspect blast radius, affected cohorts, current model version, feature freshness, upstream data health, serving saturation, recent configuration changes, and whether failures are deterministic or intermittent.

## Core knowledge
ML incidents often span software, data, and statistical failure modes simultaneously. Senior responders prioritize containment and user impact before root-cause certainty, preserve evidence, and separate correlation from causation.

## Procedure
1. Confirm the alert and identify user-visible impact.
2. Establish incident ownership, severity, and communication channel.
3. Freeze risky deployments and record current model/data/config versions.
4. Determine whether the failure is serving, feature, data, model-quality, or downstream-action related.
5. Compare affected and unaffected cohorts and prior known-good periods.
6. Contain impact using rollback, fallback, traffic reduction, or feature disablement.
7. Preserve logs, prediction samples, lineage, and relevant data snapshots.
8. Form and test ranked hypotheses rather than changing multiple variables at once.
9. Restore normal operation and monitor stabilization.
10. Produce a root-cause analysis with corrective and preventive actions.

## Decision points
Rollback immediately when impact is severe and the previous version is known good. Continue diagnosis in place only when containment risk exceeds current impact. Escalate data incidents to upstream owners when contract or lineage evidence identifies the producer.

## Common failure patterns
- Tuning the model during an active outage.
- Changing several components simultaneously.
- Losing the exact model or feature versions involved.
- Declaring recovery from infrastructure metrics while model quality remains degraded.
- Failing to monitor recurrence after mitigation.

## Verification
Verify user-impact metrics recover, model-quality and data-health indicators stabilize, mitigation is reproducible, and incident evidence supports the identified root cause.

## Expected output
An incident timeline, containment record, root cause, verified recovery evidence, and prioritized prevention actions.

## Stop conditions
Stop ad hoc experimentation and escalate when production access is insufficient, safety impact is uncertain, evidence is being lost, or mitigation requires destructive or high-risk changes.