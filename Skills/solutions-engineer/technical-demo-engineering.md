# Technical Demo Engineering

## Purpose
Build and deliver technically credible demonstrations that prove relevant capabilities against the audience's actual use case.

## When to use
Use for technical evaluations, workshops, executive demonstrations, and solution reviews.

## Inputs
Audience, desired outcomes, architecture, scenario, environment, known objections, time limit.

## Context to inspect
Customer terminology, existing workflows, product constraints, demo dependencies, network access, credentials handling, and fallback options.

## Core knowledge
A strong demo is evidence, not theater. It connects a real problem to observable behavior while avoiding claims the demonstrated system does not prove.

## Procedure
1. Define the audience decision and key proof points.
2. Choose a realistic end-to-end scenario.
3. Remove irrelevant complexity.
4. Instrument important behavior and outputs.
5. Rehearse failure-prone transitions.
6. Prepare safe fallback evidence.
7. Explain architecture and trade-offs while demonstrating.
8. Capture questions and unresolved claims.

## Decision points
Prefer live demonstrations for interactive proof; use recorded or static evidence when external dependencies make live execution unreliable.

## Common failure patterns
Feature dumping, fabricated data presented as production evidence, fragile environments, hidden prerequisites, and unsupported performance claims.

## Verification
The demo runs from a clean state, proof points are observable, and claims match demonstrated evidence.

## Expected output
A repeatable, audience-specific technical demonstration.

## Stop conditions
Stop if required access is unsafe, sensitive data cannot be protected, or the environment cannot support truthful demonstration.