# Game Day and Simulation Rules

## Purpose
Validate incident readiness and recovery assumptions before real failures occur.

## Scope
Tabletop exercises, failure injection, disaster recovery tests, and incident simulations.

## MUST
- Define learning objectives, safety boundaries, abort criteria, observers, and expected evidence before exercises.
- Protect production customers and data with approved blast-radius controls when exercises touch live systems.
- Test communication, command, access, dependencies, and recovery procedures, not only technical failover.
- Record discovered gaps and assign follow-up ownership.

## MUST NOT
- Inject uncontrolled failure into production without explicit authorization and safeguards.
- Declare readiness solely because a scripted happy path succeeded.

## SHOULD
- Vary scenarios to include ambiguous symptoms, dependency failures, degraded telemetry, and handoffs.

## Exceptions
Low-risk tabletop exercises may use simplified evidence but SHOULD still test decision and escalation behavior.

## Verification
Review exercise plans, approvals, abort controls, observed results, participant feedback, and closure of material findings.