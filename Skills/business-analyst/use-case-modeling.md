# Use Case Modeling

## Purpose
Describe end-to-end interactions between actors and a system for complex business behavior that does not fit comfortably into small user stories.

## When to use
Use for multi-step workflows, many alternate paths, external actors, or behavior requiring a stable interaction model.

## Inputs
Actors, business goals, process models, business rules, system boundaries, and known exceptions.

## Preconditions
The system boundary and primary actor goals are understood.

## Context to inspect
Existing workflows, integrations, permissions, data dependencies, exceptions, and downstream outcomes.

## Core knowledge
A use case focuses on actor goal and observable system behavior. It should remain implementation-neutral while being precise enough to derive requirements and tests.

## Procedure
1. Define the use-case goal and scope.
2. Identify primary and supporting actors.
3. State preconditions and trigger.
4. Write the main success scenario.
5. Add alternate and exception flows.
6. Reference governing business rules.
7. Define postconditions and business outcomes.
8. Check system-boundary assumptions.
9. Review with SMEs, engineering, and QA.
10. Derive traceable stories or test scenarios if needed.

## Decision points
Prefer a use case over a story when the interaction spans many steps or alternatives and shared understanding would otherwise fragment.

## Common failure patterns
Including UI design, omitting alternate flows, confusing process steps with system behavior, and creating one giant use case for unrelated goals.

## Verification
Walk all representative actor scenarios through the model and confirm resulting outcomes and exceptions are unambiguous.

## Expected output
A validated use case with actors, trigger, preconditions, main flow, alternate flows, rules, and postconditions.

## Stop conditions
Stop when the system boundary is disputed or core business behavior is unresolved.