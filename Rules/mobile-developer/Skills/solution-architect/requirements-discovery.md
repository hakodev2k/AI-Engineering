# Requirements Discovery

## Purpose
Turn ambiguous business requests into architecture-ready problem statements with explicit goals, constraints, stakeholders, assumptions, and decision boundaries.

## When to use
Use at initiative discovery, major feature planning, system replacement, integration design, or when teams disagree about what is actually required. Do not use to invent missing business policy without stakeholder evidence.

## Inputs
Business objectives, stakeholder interviews, existing system context, policies, process maps, incidents, roadmap, constraints, known risks.

## Preconditions
Identify decision makers and the business outcome being optimized.

## Context to inspect
Current workflows, upstream/downstream systems, user journeys, SLAs, compliance obligations, data ownership, operational pain points, existing architecture decisions.

## Core knowledge
Separate goals from proposed solutions. Distinguish functional requirements, quality attributes, constraints, assumptions, and out-of-scope items. Requirements should be testable enough to guide architecture choices.

## Procedure
1. Identify business outcome and measurable success criteria.
2. Map stakeholders, users, operators, and external actors.
3. Capture current-state pain points and evidence.
4. Separate mandatory constraints from preferences.
5. Identify functional capabilities and critical scenarios.
6. Elicit non-functional expectations explicitly.
7. Record assumptions and unresolved questions.
8. Identify dependencies, ownership boundaries, and policy constraints.
9. Challenge solution-first statements such as “use microservices” by asking what problem they solve.
10. Produce a concise architecture problem statement and validate it with stakeholders.

## Decision points
Escalate conflicting objectives rather than silently optimizing one. Prefer quantified requirements when a design choice materially depends on scale, latency, RTO/RPO, security, or cost.

## Common failure patterns
Accepting proposed technology as a requirement, missing operators as stakeholders, vague words such as scalable or secure, ignoring legacy constraints, failing to record assumptions.

## Verification
Confirm stakeholders agree on goals, constraints, scope, critical scenarios, and unresolved risks. Ensure each major architecture decision can trace back to a requirement or constraint.

## Expected output
Validated requirement set, assumptions, decision drivers, critical scenarios, and open questions.

## Stop conditions
Stop when critical business policy is unknown, stakeholder authority is unclear, or requirements conflict without an accountable decision maker.