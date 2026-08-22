# Network Risk and Technical Debt Management

## Purpose
Identify, prioritize, and reduce network risks and technical debt before they become outages, security incidents, or blockers to change.

## When to use
Use for lifecycle planning, architecture reviews, recurring incidents, unsupported hardware/software, capacity constraints, manual operations, or accumulated exceptions.

## Inputs
Inventory, lifecycle dates, incident history, vulnerabilities, capacity trends, architecture constraints, manual processes, exceptions, business criticality, and remediation cost.

## Context to inspect
Inspect end-of-support devices, single points, unsupported protocols, address exhaustion, undocumented dependencies, temporary rules/routes, automation gaps, and skills/ownership concentration.

## Core knowledge
Technical debt is not merely old technology; it is accumulated future cost and risk from choices, constraints, and deferred work. Prioritization should combine likelihood, impact, detectability, recovery difficulty, and business dependency.

## Procedure
1. Inventory material risks and debt with evidence.
2. Link each item to affected services and failure modes.
3. Estimate likelihood, impact, and remediation complexity.
4. Identify quick risk-reduction controls and strategic fixes.
5. Prioritize by risk reduction per cost/time, not age alone.
6. Assign owners and target windows.
7. Track accepted risks and expiry/review dates.
8. Integrate remediation into migrations and lifecycle work.
9. Measure reduction through incidents, exposure, capacity, or manual effort.

## Decision points
Replace when supportability or failure risk dominates; extend lifecycle only with explicit compensating controls. Pay down debt opportunistically when planned changes already touch the same failure domain.

## Common failure patterns
Unranked debt lists, labeling preferences as risk, permanent exceptions, unsupported hardware without spares, hidden manual dependencies, and remediation projects with no measurable risk outcome.

## Verification
Confirm high risks have owners, accepted risks have authorization, remediation removes the documented failure mode, and residual risk is reassessed.

## Expected output
A prioritized network risk/debt register with evidence, mitigation, ownership, and measurable outcomes.

## Stop conditions
Escalate when risk acceptance exceeds engineering authority, critical unsupported infrastructure has no safe remediation path, or required funding/business trade-offs are unresolved.