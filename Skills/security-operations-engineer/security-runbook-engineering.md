# Security Runbook Engineering

## Purpose
Create executable investigation and response runbooks that produce consistent outcomes while preserving analyst judgment at real decision points.

## When to use
Use for recurring alert classes, new detections, incident procedures and operational handoffs.

## Inputs
Detection rationale, required evidence, APIs/tools, decision policy, escalation matrix and known failure modes.

## Context to inspect
Observe how analysts actually perform the workflow, including access boundaries, tool latency and exceptional cases.

## Core knowledge
A runbook should encode sequence, evidence and decisions, not blindly prescribe clicks. It must be testable, versioned and owned.

## Procedure
1. Define trigger and intended outcome.
2. State prerequisites and required permissions.
3. Identify evidence to collect before modifying systems.
4. Write ordered investigation steps with query intent.
5. Define decision branches and confidence criteria.
6. Specify containment/remediation actions and approvals.
7. Include escalation and communication paths.
8. Define verification and closure evidence.
9. Add failure/rollback paths.
10. Test with representative scenarios.
11. Version, review and assign owner.
12. Update after incidents and tooling changes.

## Decision points
Automate deterministic steps; retain analyst gates where context materially changes risk. Separate platform-specific commands from platform-independent reasoning when possible.

## Common failure patterns
Screenshot-driven procedures; stale UI paths; no stop conditions; destructive actions before evidence capture; unclear authority.

## Verification
A qualified analyst unfamiliar with the case can execute the runbook safely and produce the required evidence.

## Expected output
A versioned, tested runbook with trigger, procedure, decisions, verification and owner.

## Stop conditions
Do not publish destructive procedures without approval boundaries, rollback guidance and validation.