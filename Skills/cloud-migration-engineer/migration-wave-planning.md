# Migration Wave Planning

## Purpose
Sequence migration units into executable waves that balance dependency order, business risk, team capacity, and learning.

## When to use
Use after workload assessment and target readiness, and continuously as pilot evidence changes assumptions.

## Inputs
Migration-unit catalog, dependencies, treatments, business calendars, criticality, team capacity, target quotas, data-transfer durations, testing effort, and change windows.

## Preconditions
Critical dependencies and workload owners must be identified. Each candidate must have a provisional migration strategy.

## Context to inspect
Inspect shared databases, identity, networks, batch chains, release calendars, freeze periods, vendor dependencies, support coverage, environment promotion order, and rollback constraints.

## Core knowledge
Good waves minimize cross-environment chatter and unresolved dependencies while preserving learning. Early waves should be representative enough to expose platform/process gaps but not carry unacceptable blast radius.

## Procedure
1. Define wave-entry criteria.
2. Build a dependency graph of migration units.
3. Identify foundational/shared services that constrain sequencing.
4. Select pilot candidates with moderate complexity and manageable business impact.
5. Estimate engineering, testing, data transfer, and support effort.
6. Group tightly coupled components where separation increases risk.
7. Avoid concentrating too many critical systems in one window.
8. Align waves with business and release calendars.
9. Reserve capacity for remediation and rollback.
10. Define wave-specific success gates.
11. Review target quotas and support staffing.
12. Publish sequence with assumptions and confidence.
13. Re-plan after each wave using actual durations and defects.

## Decision points
Migrate dependencies together when temporary cross-environment latency or consistency is unsafe. Separate them when stable interfaces permit independent validation. Prefer smaller waves while the migration factory is immature; increase throughput only after repeatability is demonstrated.

## Common failure patterns
Sequencing by server count; ignoring business calendars; overloading shared SMEs; pilot too trivial to teach anything; critical shared service moved without dependents; no buffer for defects; treating the plan as immutable.

## Verification
Dependency conflicts are reviewed, capacity fits available teams, every wave has owners and gates, and pilot learnings are reflected in subsequent estimates.

## Expected output
A dependency-aware migration wave plan with entry criteria, dates/windows, owners, capacity assumptions, risks, and success gates.

## Stop conditions
Stop when critical dependencies remain unknown, business windows are unapproved, required target capacity is unavailable, or the wave exceeds tested migration throughput.