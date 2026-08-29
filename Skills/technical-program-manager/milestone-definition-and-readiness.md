# Milestone Definition and Readiness

## Purpose
Define milestones with objective entry, exit, and readiness criteria so program progress reflects validated capability rather than task completion.

## When to use
Use for major integration points, launches, migrations, security gates, pilots, and production cutovers.

## Inputs
Program plan, technical deliverables, quality gates, operational requirements, dependency map.

## Context to inspect
Existing release criteria, test strategy, SLOs, support readiness, rollback plans, and compliance obligations.

## Core knowledge
A milestone is meaningful only when evidence proves a usable state. Senior TPMs separate implementation complete from validated, deployable, and operationally ready.

## Procedure
1. Define the capability the milestone must prove.
2. Specify entry criteria and prerequisites.
3. Define measurable exit criteria.
4. Add integration, security, performance, support, and rollback checks where relevant.
5. Assign evidence owners.
6. Review readiness before the planned date, not on it.
7. Record exceptions and explicit risk acceptance.
8. Close the milestone only after evidence is verified.

## Decision points
Split milestones when one gate mixes unrelated risk domains. Use conditional approval only when residual risk is bounded and owned.

## Common failure patterns
Date-only milestones, subjective readiness, missing rollback evidence, and declaring complete before integration testing.

## Verification
Confirm every criterion has evidence, owner, and pass/fail state.

## Expected output
A milestone checklist that supports defensible go/no-go decisions.

## Stop conditions
Stop when critical evidence is missing, acceptance criteria change without approval, or unresolved risk exceeds tolerance.