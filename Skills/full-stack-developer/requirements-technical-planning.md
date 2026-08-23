# Requirements and Technical Planning

## Purpose
Convert product intent into implementable full-stack work with explicit assumptions, risks, contracts, and verification.

## When to use
Feature discovery, estimation, ambiguous tickets, cross-team work, or technically risky changes.

## Inputs
Business goal, user journeys, acceptance criteria, existing system, constraints, dependencies.

## Context to inspect
Relevant UI, APIs, schema, integrations, telemetry, deployment topology, historical decisions and similar features.

## Core knowledge
A Senior full-stack developer distinguishes desired outcome from proposed implementation, surfaces hidden cross-layer effects, and reduces uncertainty before committing to a design.

## Procedure
1. Restate the user/business outcome.
2. Identify actors, flows, edge cases, and failure states.
3. Inspect existing implementation and conventions.
4. Map changes across frontend, API, data, integrations, security, and operations.
5. Identify unknowns and assumptions.
6. Define contracts and compatibility requirements.
7. Evaluate alternatives and trade-offs.
8. Split work into independently verifiable increments.
9. Define test and rollout strategy.
10. Record material risks and decisions.

## Decision points
Prototype when uncertainty is technical and cheap to test; seek product clarification when behavior changes business semantics. Prefer incremental delivery when compatibility permits.

## Common failure patterns
Estimating before inspection, treating a UI request as frontend-only, ignoring migration/authorization, solving the proposed implementation instead of the goal, and hiding assumptions.

## Verification
Plan covers acceptance criteria, affected layers, dependencies, test evidence, deployment, rollback, and unresolved decisions.

## Expected output
An implementation-ready technical plan with bounded uncertainty.

## Stop conditions
Stop when critical business behavior or destructive data implications require explicit approval.