# Launch Readiness and Go/No-Go

## Purpose
Coordinate a rigorous launch decision using technical, operational, security, support, dependency, and rollback evidence.

## When to use
Use before customer-facing launches, major platform releases, migrations, or irreversible production changes.

## Inputs
Readiness criteria, test results, defect status, SLOs, support plan, rollback plan, dependencies, risks.

## Context to inspect
Release procedures, incident history, change windows, observability, runbooks, staffing, communications, and approval requirements.

## Core knowledge
Launch readiness is a risk decision, not a checklist ceremony. Senior TPMs distinguish blocking defects from accepted residual risk and ensure decision authority is explicit.

## Procedure
1. Define launch criteria and approvers early.
2. Gather evidence for functionality, performance, security, reliability, support, and rollback.
3. Confirm dependency and environment readiness.
4. Review unresolved defects by severity and exposure.
5. Validate monitoring, runbooks, ownership, and on-call coverage.
6. Present residual risks with explicit owners.
7. Conduct go/no-go against predefined criteria.
8. Record the decision, exceptions, and rollback triggers.
9. Communicate launch state to all affected teams.

## Decision points
Proceed with known risk only when impact is bounded, mitigation exists, and the correct authority accepts it. Delay when rollback is unproven for high-impact change.

## Common failure patterns
Last-minute criteria, social pressure to launch, unclear rollback triggers, missing support readiness, and risk acceptance without authority.

## Verification
Confirm all mandatory criteria have evidence and every exception has owner, approver, and contingency.

## Expected output
A defensible go/no-go decision and synchronized launch plan.

## Stop conditions
Stop when critical criteria fail, telemetry or rollback is unavailable, or required approvers cannot accept residual risk.