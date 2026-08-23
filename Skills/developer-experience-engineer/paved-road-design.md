# Paved Road Design

## Purpose
Define supported engineering paths that make the secure, reliable, maintainable choice the easiest default.

## When to use
Use when teams repeatedly solve the same infrastructure or application-platform concerns differently.

## Inputs
Common workloads, architecture constraints, incidents, compliance requirements, platform capabilities, and developer feedback.

## Context to inspect
Inspect existing patterns, legitimate exceptions, adoption barriers, lifecycle ownership, and operational burden.

## Core knowledge
A paved road succeeds through value and low friction, not central mandate alone. It must expose escape hatches for justified cases.

## Procedure
1. Identify recurring problems with high duplication cost.
2. Define supported workload boundaries.
3. Establish secure and observable defaults.
4. Package templates, APIs, automation, and documentation.
5. Minimize required decisions for common cases.
6. Define extension and exception mechanisms.
7. Pilot with diverse teams.
8. Measure adoption, time saved, incidents, and bypass reasons.
9. Evolve based on evidence.

## Decision points
Standardize commodity concerns; preserve team choice where domain-specific differentiation matters.

## Common failure patterns
Golden paths that are mandatory but inferior, no escape hatch, stale templates, hidden platform coupling, and optimizing platform convenience over user outcomes.

## Verification
Have teams deliver representative changes using the paved road and compare effort, reliability, security, and support load with prior approaches.

## Expected output
A supported path with clear boundaries, defaults, automation, documentation, exception policy, and adoption metrics.

## Stop conditions
Stop when workload diversity invalidates a common abstraction or platform ownership cannot support the promised lifecycle.