# Network Change Management

## Purpose
Execute network changes with explicit risk control, evidence, communication, rollback, and post-change verification.

## When to use
Use for production configuration, firmware, routing, firewall, circuit, DNS, topology, or cloud-network changes with meaningful service impact.

## Inputs
Change objective, affected systems, configuration diff, dependencies, risk assessment, maintenance window, test plan, rollback, owners, and communications.

## Context to inspect
Inspect current state, recent incidents/changes, redundancy health, backups, out-of-band access, monitoring, freeze periods, and dependent teams.

## Core knowledge
A good change plan distinguishes implementation from verification and rollback triggers. Network changes can remove the very access needed to repair them, so recovery paths matter before execution.

## Procedure
1. Define intended outcome and non-goals.
2. Capture current state and backups.
3. Review dependencies and blast radius.
4. Produce exact implementation steps.
5. Define pre-checks, post-checks, and success criteria.
6. Define objective rollback triggers and steps.
7. Confirm out-of-band/recovery access.
8. Communicate timing and ownership.
9. Execute incrementally and observe telemetry.
10. Verify user/service outcomes and close documentation.

## Decision points
Use phased rollout when scope can be segmented. Defer a change if redundancy is already degraded or preconditions fail, even if the maintenance window is open.

## Common failure patterns
No rollback trigger, stale backups, changing multiple unrelated variables, assuming HA is healthy, inadequate stakeholder notice, and validating only device configuration.

## Verification
Confirm pre/post state, intended traffic, redundancy, monitoring, user impact, and absence of unexpected errors before declaring success.

## Expected output
An auditable change record with implementation, validation evidence, outcome, and any follow-up actions.

## Stop conditions
Abort when pre-checks fail, blast radius expands unexpectedly, monitoring degrades, recovery access is lost, or rollback threshold is reached.