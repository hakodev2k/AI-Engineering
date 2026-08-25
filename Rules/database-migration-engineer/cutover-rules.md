# Cutover

## Purpose
Control the moment production authority moves to the target system.

## Scope
Applies to traffic, connection, write-authority, routing, and ownership cutovers.

## MUST
- Cutover MUST define prerequisites, responsible operators, sequence, validation gates, abort criteria, communications, and recovery actions.
- Write authority MUST be unambiguous at every cutover phase unless an explicitly designed multi-writer protocol is used.
- Final synchronization lag and target health MUST meet documented thresholds before switching authority.

## MUST NOT
- MUST NOT improvise production cutover steps that alter data authority without approval.
- MUST NOT continue past a failed safety gate merely to meet a schedule.

## SHOULD
- Automate deterministic steps while retaining human approval at irreversible boundaries.
- Keep the old path available until target validation satisfies retirement criteria.

## Exceptions
Emergency cutovers require incident authority, explicit risk acceptance, and post-event evidence capture.

## Verification
Use runbook checklists, timestamps, replication metrics, application probes, reconciliation, and operator sign-off.