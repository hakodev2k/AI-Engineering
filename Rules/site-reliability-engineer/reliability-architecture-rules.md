# Reliability Architecture Rules

## Purpose
Ensure architecture choices make failure behavior explicit and keep critical systems recoverable.

## Scope
Applies to service boundaries, redundancy, dependencies, failover, state management, and reliability-sensitive design changes.

## MUST
- Critical components MUST document failure modes, blast radius, and recovery behavior.
- Single points of failure MUST be identified and either removed or explicitly accepted with evidence and ownership.
- Architecture decisions affecting reliability MUST document trade-offs, assumptions, and operational consequences.
- Stateful components MUST define durability, replication, restore, and consistency expectations.
- Reliability mechanisms MUST be tested rather than assumed from topology diagrams.

## MUST NOT
- MUST NOT add redundancy without validating correlated-failure risks.
- MUST NOT hide dependency failure behind indefinite retries or silent degradation.
- MUST NOT approve a critical design whose recovery path is unknown.

## SHOULD
- Prefer simple failure domains and bounded blast radius.
- Design graceful degradation for noncritical functionality where feasible.

## Exceptions
Accepted architectural reliability gaps require risk owner, compensating controls, review date, and explicit rationale.

## Verification
Use architecture reviews, failure-mode analysis, resilience tests, dependency maps, recovery exercises, and incident evidence.