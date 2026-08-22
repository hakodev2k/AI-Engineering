# Organizational Change Management

## Purpose
Lead engineering changes in structure, process, tooling, ownership, or architecture so intended benefits survive contact with real workflows and incentives.

## When to use
Use for reorganizations, platform adoption, process changes, ownership transfers, operating-model changes, or major engineering standards.

## Inputs
Desired outcome, affected teams, current workflow, stakeholder map, incentives, risks, dependencies, migration constraints, and success measures.

## Context to inspect
Inspect why the current behavior exists, who bears migration cost, local incentives, capability gaps, existing commitments, and previous failed change attempts.

## Core knowledge
Change succeeds through behavior and system design, not announcements. Adoption depends on usefulness, incentives, migration support, local context, and feedback loops.

## Procedure
1. Define the problem and measurable desired behavior or outcome.
2. Identify affected groups and likely sources of friction.
3. Preserve useful properties of the current system.
4. Design the smallest viable transition with clear ownership.
5. Pilot with representative users where uncertainty is high.
6. Provide tooling, documentation, training, and migration support.
7. Align incentives and decision rights with the new model.
8. Track adoption and outcome metrics separately.
9. Gather feedback and remove unnecessary friction.
10. Retire old paths only when the replacement is demonstrably viable.

## Decision points
Use phased migration when reversibility and learning matter; use coordinated cutover when dual operation creates unacceptable risk or complexity.

## Common failure patterns
Announce-and-forget, mandatory adoption before readiness, measuring attendance instead of behavior, ignoring migration workload, and keeping old and new systems indefinitely.

## Verification
Verify intended behavior changed, users can operate the new model, old dependencies are retired as planned, and outcome metrics improved without unacceptable side effects.

## Expected output
A change plan with stakeholders, migration stages, support, adoption measures, risks, and exit criteria.

## Stop conditions
Escalate when change affects employment terms, regulated responsibilities, contractual obligations, or organizational authority beyond the manager's mandate.