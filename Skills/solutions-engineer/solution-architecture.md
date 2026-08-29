# Solution Architecture

## Purpose
Design a feasible customer solution that maps requirements to components, interfaces, deployment boundaries, and operational responsibilities.

## When to use
Use after discovery when a proposed architecture must be evaluated or communicated.

## Inputs
Requirements, current architecture, product capabilities, integration constraints, NFRs, migration constraints.

## Context to inspect
Supported deployment patterns, limits, dependencies, security controls, network/data flows, ownership and failure domains.

## Core knowledge
Good solution architecture optimizes the whole system rather than maximizing use of one product. Boundaries, failure modes, state, data movement, and operational ownership must be explicit.

## Procedure
1. Map requirements to capabilities.
2. Define system boundaries and responsibilities.
3. Model data and control flows.
4. Identify stateful components and consistency needs.
5. Design security and network boundaries.
6. Address availability, scaling, observability, and recovery.
7. Evaluate alternatives and trade-offs.
8. Document assumptions, risks, and unsupported requirements.

## Decision points
Prefer the simplest architecture meeting verified requirements. Add redundancy or abstraction only where risk justifies complexity.

## Common failure patterns
Architecture by diagram aesthetics, hidden single points of failure, undocumented assumptions, excessive components, and ignored operational ownership.

## Verification
Trace every critical requirement to an architectural mechanism and validate high-risk assumptions through evidence or tests.

## Expected output
A reviewable architecture with rationale, flows, risks, and trade-offs.

## Stop conditions
Stop when required capabilities are unsupported or critical constraints remain unknown.