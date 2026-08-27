# Firmware Architecture

## Purpose
Design maintainable firmware boundaries that separate hardware adaptation, platform services, domain logic and product behavior.

## When to use
Use during new firmware design, major feature integration, platform migration or architectural refactoring.

## Inputs
Requirements, repository, target platform, interfaces, timing constraints, memory budget and product lifecycle needs.

## Context to inspect
Existing modules, dependency direction, build variants, hardware abstraction, state ownership, generated code and test seams.

## Core knowledge
Firmware architecture must balance portability, determinism, testability and resource cost. Boundaries should follow reasons to change rather than arbitrary layer counts.

## Procedure
1. Identify product capabilities and quality attributes.
2. Map hardware-dependent and hardware-independent responsibilities.
3. Define module ownership and interfaces.
4. Make dependency direction explicit.
5. Separate policy from mechanism.
6. Define concurrency and state ownership.
7. Establish error propagation and observability paths.
8. Create host-testable seams where useful.
9. Validate flash, RAM and timing overhead.
10. Record major trade-offs.

## Decision points
Choose static composition for predictable systems; introduce runtime indirection only when configurability or testability justifies its cost.

## Common failure patterns
Global mutable state, circular dependencies, leaking vendor APIs through the codebase, oversized managers, hidden initialization order and architecture that cannot be tested off-target.

## Verification
Build all variants, run architecture checks and tests, inspect dependency graph, and measure resource/timing impact.

## Expected output
Clear module boundaries, interfaces and documented trade-offs.

## Stop conditions
Escalate when requirements or ownership boundaries are too ambiguous to make a reversible architecture decision.