# Production Incident Response

## Purpose
Restore MySQL-backed services safely during incidents while preserving evidence and preventing secondary damage.

## When to use
Use for database availability, latency, corruption suspicion, replication, capacity, or operational incidents.

## Inputs
Incident symptoms, timeline, alerts, metrics, logs, topology, recent changes, business impact.

## Context to inspect
Connections, query workload, locks, CPU/memory/I/O, disk, replication, error log, deployment/change history, backup state.

## Core knowledge
Incident response prioritizes impact reduction and reversible actions. Database symptoms may originate in applications, infrastructure, or dependencies. Preserve diagnostic evidence before disruptive remediation when feasible.

## Procedure
1. Declare scope, severity, ownership, and communication channel.
2. Confirm user impact and affected database nodes/workloads.
3. Freeze risky changes and capture a timeline.
4. Check availability, saturation, waits, top statements, replication, and storage.
5. Correlate onset with releases/configuration/topology events.
6. Apply the safest reversible mitigation: shed load, rollback, kill proven runaway work, fail over, or scale.
7. Continuously verify impact after each action.
8. Restore redundancy and monitoring.
9. Preserve evidence and document root cause separately from mitigation.
10. Produce corrective actions with owners and verification.

## Decision points
Favor rollback/load shedding over live tuning when causality is uncertain. Fail over only when candidate safety and fencing are established.

## Common failure patterns
Multiple simultaneous changes, restarting before collecting evidence, killing arbitrary sessions, blame-driven diagnosis, and declaring recovery before tail latency/error rate normalizes.

## Verification
Confirm SLO recovery, successful writes/reads, replication health, capacity headroom, and absence of hidden data-integrity issues.

## Expected output
Recovered service, incident timeline, evidence, root cause, and corrective actions.

## Stop conditions
Escalate immediately for suspected corruption, uncertain writer authority, security compromise, or recovery actions exceeding approved risk.