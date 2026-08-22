# Non-Functional Requirements

## Purpose
Elicit measurable quality attributes and operational constraints that shape whether a solution is acceptable in production.

## When to use
Use for new systems, major changes, integrations, migrations, and any initiative where performance, availability, security, usability, compliance, or supportability matter.

## Inputs
Business criticality, user volumes, service expectations, risk appetite, regulatory obligations, architecture constraints, and operational history.

## Preconditions
Business scenarios and critical user journeys are understood.

## Context to inspect
Peak volumes, outage impact, recovery needs, geographic usage, data sensitivity, accessibility needs, auditability, maintenance windows, and support model.

## Core knowledge
NFRs must be scenario-based and measurable. Terms such as fast, scalable, secure, or highly available are not requirements until thresholds and conditions are defined.

## Procedure
1. Identify business-critical scenarios.
2. Determine relevant quality attributes for each scenario.
3. Capture operating conditions and expected loads.
4. Define measurable targets and tolerances.
5. Record compliance and policy constraints.
6. Distinguish hard constraints from negotiable targets.
7. Identify trade-offs between qualities, cost, and delivery time.
8. Validate feasibility with architecture and engineering.
9. Link NFRs to acceptance, monitoring, and operational evidence.
10. Review after material scope or load changes.

## Decision points
Set stricter targets only where business impact justifies cost and complexity. Use percentiles and scenario-specific targets instead of global averages when appropriate.

## Common failure patterns
Copying generic NFR templates, using unmeasurable adjectives, ignoring peak conditions, and discovering recovery requirements after implementation.

## Verification
Confirm each material NFR has a measurable threshold, scenario, owner, and planned verification method.

## Expected output
A prioritized, measurable set of non-functional requirements with rationale and verification evidence expectations.

## Stop conditions
Escalate when required service levels conflict with budget, architecture, policy, or operational capability.