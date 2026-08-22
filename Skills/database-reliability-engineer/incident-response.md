# Database Incident Response

## Purpose
Restore database-backed services safely during production incidents while preserving evidence and limiting secondary damage.

## When to use
Use for severe latency, errors, unavailable databases, corruption signals, replication failures, or resource exhaustion.

## Inputs
Incident symptoms, dashboards, logs, traces, recent changes, topology, runbooks, and business impact.

## Context to inspect
Current health, affected workloads, blast radius, recent deployments, locks, resource saturation, replication, storage, and dependencies.

## Core knowledge
During incidents, stabilize before optimizing. Prefer reversible mitigations, explicit ownership, timestamps, and evidence-driven hypotheses.

## Procedure
1. Declare severity and assign incident roles.
2. Confirm user impact and blast radius.
3. Freeze risky changes where appropriate.
4. Check recent changes and major saturation signals.
5. Form and test ranked hypotheses.
6. Apply the safest high-leverage mitigation.
7. Verify recovery from user-facing metrics.
8. Preserve timeline and evidence.
9. Restore redundancy and normal safeguards.
10. Hand off follow-up actions.

## Decision points
Choose failover, load shedding, rollback, query cancellation, or scaling based on evidence and reversibility.

## Common failure patterns
Random tuning, destructive commands under pressure, simultaneous uncoordinated changes, ignoring application behavior, and declaring recovery from infrastructure metrics alone.

## Verification
Confirm SLO indicators recover, backlog drains, replicas stabilize, and no hidden data-integrity issue remains.

## Expected output
Restored service, incident timeline, verified mitigation, residual risks, and follow-up actions.

## Stop conditions
Escalate destructive actions, suspected corruption, unknown failover safety, or changes beyond incident authority.