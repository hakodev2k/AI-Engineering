# Runbook Engineering

## Purpose
Create operational procedures that help responders act safely under pressure.

## When to use
Use for recurring incidents, maintenance, failover, recovery, manual controls, or high-risk troubleshooting.

## Inputs
Operational task, prerequisites, permissions, telemetry, recovery actions, escalation contacts.

## Context to inspect
Incident history, existing docs, tooling, access requirements, automation opportunities, known hazards.

## Core knowledge
A useful runbook is task-oriented, evidence-driven, versioned, tested, and explicit about rollback and escalation. Avoid generic descriptions.

## Procedure
1. State trigger and scope.
2. List prerequisites and required access.
3. Define initial health/evidence checks.
4. Provide ordered commands/actions with expected outcomes.
5. Mark destructive or irreversible steps.
6. Define decision branches.
7. Add rollback and verification.
8. Add escalation conditions.
9. Test with someone other than author.
10. Automate stable repetitive steps later.

## Decision points
Keep human judgment where context matters; automate deterministic steps; split long runbooks by incident/task boundary.

## Common failure patterns
Copy-paste commands without validation, outdated hostnames, missing expected output, no rollback, secret values in docs.

## Verification
A qualified responder can execute the runbook in a test scenario and reach expected state without undocumented knowledge.

## Expected output
Versioned, tested operational runbook with clear safety and escalation.

## Stop conditions
Stop publishing if critical commands or recovery behavior are unverified.