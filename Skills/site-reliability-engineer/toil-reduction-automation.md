# Toil Reduction and Automation

## Purpose
Identify repetitive operational work that scales with service growth and replace it with safe, maintainable automation.

## When to use
Use when on-call or operations teams repeatedly perform manual remediation, provisioning, validation, reporting, or recovery steps.

## Inputs
Operational task logs, incident history, on-call workload, runbooks, frequency/duration data, error rates, and automation opportunities.

## Preconditions
The manual process must be understood well enough to describe its inputs, decisions, side effects, and failure modes.

## Context to inspect
Tickets, incident actions, runbooks, scripts, dashboards, access controls, dependencies, approval requirements, and prior automation failures.

## Core knowledge
Toil is manual, repetitive, automatable, tactical work that grows with service demand and provides little enduring value. Automation should remove repeated labor without hiding risk or creating an unowned critical system.

## Procedure
1. Measure recurring operational work by frequency, time, cognitive load, and risk.
2. Rank candidates by cost and reliability impact.
3. Map the manual workflow including exceptions and approvals.
4. Decide whether elimination, product change, self-service, or automation is best.
5. Define safe inputs, idempotency, permissions, limits, and audit logging.
6. Implement the smallest reliable automation.
7. Add dry-run or preview mode for destructive or high-impact actions.
8. Test success, partial failure, retries, and rollback.
9. Document ownership and operational support.
10. Measure toil removed and new failure modes introduced.
11. Retire obsolete manual steps and scripts.

## Decision points
Prefer eliminating unnecessary work over automating it. Prefer self-service workflows when another team legitimately owns the business decision. Keep human approval for actions whose risk cannot be safely bounded.

## Common failure patterns
Automating a broken process, scripts with broad credentials, no idempotency, hidden manual prerequisites, silent partial failure, and automation with no owner.

## Verification
Compare before/after toil hours, verify automated actions are auditable and repeatable, and test failure paths without relying on undocumented operator knowledge.

## Expected output
A prioritized toil backlog, safe automation, ownership, runbook updates, and measured reduction in recurring effort.

## Stop conditions
Escalate when automation would require excessive privileges, irreversible actions, unclear policy decisions, or unsupported production access.