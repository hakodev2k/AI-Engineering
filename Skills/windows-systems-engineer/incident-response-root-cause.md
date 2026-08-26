# Windows Incident Response and Root Cause Analysis

## Purpose
Restore Windows-based services safely during incidents while preserving evidence and producing defensible root-cause findings.

## When to use
Use for production outages, widespread authentication failures, infrastructure degradation, repeated crashes, or severe configuration regressions.

## Inputs
Incident symptoms, timeline, affected services/hosts, recent changes, telemetry, logs, dependencies, responders, and business impact.

## Preconditions
Establish incident command/ownership for high-severity events. Separate restoration actions from irreversible forensic changes.

## Context to inspect
Monitoring, Windows events, deployment/change records, AD/DNS/network state, service/process health, resource metrics, patching, security telemetry, and known-good comparisons.

## Core knowledge
Incident response prioritizes impact containment and restoration, while RCA requires causal evidence. Correlation is not causation. A proximate trigger may differ from systemic root cause and contributing conditions.

## Procedure
1. Define impact, scope, severity, and start time.
2. Freeze unnecessary changes and establish communication ownership.
3. Preserve volatile evidence proportionate to severity.
4. Compare affected and unaffected systems.
5. Identify the earliest verified abnormal event.
6. Form and test hypotheses across identity, DNS/network, compute, storage, OS, and application layers.
7. Apply the safest reversible mitigation.
8. Validate service restoration from the user perspective.
9. Continue evidence analysis to distinguish trigger, root cause, and contributing factors.
10. Produce corrective actions with owners and verification criteria.

## Decision points
Rollback a recent change when evidence and risk favor it; do not rollback reflexively if it destroys evidence or worsens state. Escalate security indicators to the incident-security process immediately.

## Common failure patterns
Restarting everything, changing multiple layers, anchoring on the latest deployment, losing timestamps, declaring root cause without reproduction/evidence, and writing corrective actions that only say 'monitor more'.

## Verification
Confirm service recovery, monitor stability, reproduce or otherwise substantiate causal mechanism where feasible, and verify corrective actions address recurrence paths.

## Expected output
Restored service plus an evidence-based incident timeline and actionable RCA.

## Stop conditions
Stop normal troubleshooting and escalate for suspected compromise, data loss, unsafe destructive recovery, or cross-domain decisions outside authority.