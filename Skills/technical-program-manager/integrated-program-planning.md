# Integrated Program Planning

## Purpose
Create an executable cross-team plan that integrates scope, sequencing, milestones, dependencies, validation, and operational readiness.

## When to use
Use after the program charter is agreed and before execution begins, or when an existing plan no longer reflects technical reality.

## Inputs
Charter, workstream estimates, dependency map, release constraints, staffing assumptions, risk register, validation requirements.

## Context to inspect
Engineering roadmaps, architecture milestones, environment availability, product launch dates, compliance reviews, migration windows, and team capacity.

## Core knowledge
A Senior TPM plans around dependency logic and evidence, not optimistic task aggregation. Integrated plans expose uncertainty, critical-path assumptions, decision deadlines, and validation gates.

## Procedure
1. Decompose the program into independently owned workstreams.
2. Define measurable entry and exit criteria for each milestone.
3. Sequence work based on technical dependencies.
4. Estimate ranges and record confidence levels.
5. Identify critical path, near-critical path, and schedule slack.
6. Add integration, testing, security, migration, and rollback activities.
7. Mark decision deadlines and external commitments.
8. Validate capacity with team owners.
9. Review scenarios for delay, scope reduction, or parallelization.
10. Publish a versioned integrated plan with clear owners.

## Decision points
Use milestone planning for uncertain discovery work and detailed task planning only where execution is understood. Split milestones when acceptance criteria are too broad to verify.

## Common failure patterns
False precision, missing integration time, ignoring operational readiness, hidden contingency, and dates without owner commitment.

## Verification
Walk the plan backward from the target outcome, confirm predecessor logic, and verify every milestone has objective acceptance evidence.

## Expected output
A realistic integrated program plan with owners, dependencies, decision points, confidence, and verification gates.

## Stop conditions
Stop when estimates lack technical owner input, critical dependencies are unresolved, or the plan requires impossible capacity.