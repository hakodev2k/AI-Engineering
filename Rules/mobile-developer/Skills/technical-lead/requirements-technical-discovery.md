# Requirements Technical Discovery

## Purpose
Convert ambiguous requests into implementable technical scope while exposing hidden assumptions and risks.

## When to use
Use before significant features, integrations, migrations, or cross-team changes.

## Inputs
Requirements, stakeholder goals, workflows, existing contracts, constraints, telemetry.

## Context to inspect
Inspect current behavior, consumers, data ownership, failure handling, security boundaries, dependencies, and operational expectations.

## Core knowledge
Requirements include functional behavior and quality attributes. Unknowns should be converted into questions, experiments, or explicit assumptions before irreversible implementation.

## Procedure
1. State the user and business outcome.
2. Map actors and critical workflows.
3. Separate required behavior from proposed implementation.
4. Identify data, integration, security, performance, and reliability needs.
5. Find ambiguous terms and contradictory expectations.
6. Inspect existing conventions and constraints.
7. Record assumptions and unresolved questions.
8. Define acceptance and operational criteria.
9. Identify spikes needed to reduce uncertainty.
10. Produce bounded technical scope.

## Decision points
Use a discovery spike when uncertainty dominates implementation risk. Defer optional capability when it does not support the validated outcome.

## Common failure patterns
Coding from ticket text alone, treating proposed solutions as requirements, missing NFRs, and silently assuming ownership or consistency guarantees.

## Verification
Acceptance criteria are testable, dependencies are identified, assumptions are visible, and major risks have mitigation paths.

## Expected output
Technical discovery notes with scope, constraints, assumptions, questions, risks, and acceptance evidence.

## Stop conditions
Stop when critical business behavior or ownership cannot be resolved without stakeholder authority.