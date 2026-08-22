# Game Day Facilitation

## Purpose
Coordinate multi-team resilience exercises that test technology, operational response, communication, and decision-making under controlled failure.

## When to use
Use for critical services, cross-team dependencies, DR readiness, and incident-response practice.

## Inputs
Scenario, participating teams, architecture, runbooks, objectives, communication channels, and safety plan.

## Context to inspect
Review ownership, escalation paths, experiment controls, production calendar, observability, and participant readiness.

## Core knowledge
A game day is a learning exercise, not a surprise exam. Participants need clear safety boundaries while the exact failure progression may remain partially unknown.

## Procedure
1. Define learning objectives and scope.
2. Assign facilitator, fault operator, observers, and safety owner.
3. Prepare scenario timeline and injects.
4. Confirm communications and abort controls.
5. Brief participants on boundaries and evidence collection.
6. Execute the scenario while recording decisions and timings.
7. Allow responders to use normal tools and runbooks.
8. End safely and verify recovery.
9. Run a blameless debrief and assign improvements.

## Decision points
Use announced exercises for new teams and more realistic limited-information scenarios for mature responders. Keep fault control separate from incident command.

## Common failure patterns
Testing people instead of systems, too many simultaneous faults, no observers, unclear authority, and action items without owners.

## Verification
Confirm objectives were exercised, recovery completed, evidence was captured, and follow-up work is owned.

## Expected output
Game-day record with findings, response timings, and remediation actions.

## Stop conditions
Stop for real incidents, unsafe impact, loss of control, or participant confusion that invalidates the exercise.