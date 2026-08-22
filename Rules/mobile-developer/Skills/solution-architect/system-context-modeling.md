# System Context Modeling

## Purpose
Establish clear system boundaries, actors, external dependencies, data flows, ownership, and trust relationships before deeper architecture design.

## When to use
Use for new systems, major integrations, platform decomposition, modernization, and security reviews.

## Inputs
Requirements, existing diagrams, service inventory, user roles, external systems, integration contracts, data domains.

## Preconditions
Business scope and primary outcomes are understood.

## Context to inspect
Organization ownership, source-of-truth systems, network boundaries, identity providers, third-party dependencies, manual processes, batch transfers, event streams.

## Core knowledge
A context model should clarify what is inside the solution, what is external, who interacts with it, and what information crosses boundaries. It is not an implementation diagram.

## Procedure
1. Define the system of interest and its responsibility.
2. Identify human and machine actors.
3. Identify upstream and downstream systems.
4. Label each interaction with intent and data exchanged.
5. Mark ownership and trust boundaries.
6. Identify synchronous, asynchronous, manual, and batch interactions.
7. Flag unknown ownership or undocumented dependencies.
8. Check whether any external dependency is actually part of the system boundary.
9. Validate the model with domain and operations stakeholders.
10. Use the context model as the anchor for container/component design.

## Decision points
Keep the model technology-light. Split systems only when ownership or responsibility differs materially.

## Common failure patterns
Mixing deployment nodes with business systems, omitting users/operators, unlabeled arrows, hiding third-party dependencies, unclear ownership.

## Verification
Every critical use case can be traced through the context model and every external dependency has an owner and purpose.

## Expected output
A stable context diagram plus concise boundary and dependency notes.

## Stop conditions
Stop when critical dependencies or ownership cannot be confirmed.