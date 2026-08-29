# Technical Onboarding

## Purpose
Guide a customer from purchase or handoff to a stable, supportable, and operationally understood deployment with clear ownership and acceptance criteria.

## When to use
Use for new accounts, new products, major expansions, or takeover of an inherited deployment.

## Inputs
Architecture, implementation plan, product scope, prerequisites, support model, security requirements, integrations, environments, and success criteria.

## Context to inspect
Deployment topology, identity, network paths, data flows, dependencies, support entitlements, operational ownership, observability, change controls, and production readiness.

## Core knowledge
Onboarding is complete only when the customer can operate the solution reliably, not when installation succeeds. Senior TAMs surface operational and organizational gaps early.

## Procedure
1. Confirm scope, outcomes, owners, and implementation boundaries.
2. Validate technical prerequisites and unsupported assumptions.
3. Review architecture, dependencies, security, and environment separation.
4. Define readiness gates for test and production.
5. Establish support, escalation, and maintenance processes.
6. Confirm monitoring, backup, recovery, and runbook responsibilities where relevant.
7. Track integration and adoption blockers to closure.
8. Perform a production-readiness review before go-live.
9. Capture lessons, unresolved risks, and post-launch checkpoints.

## Decision points
Use phased onboarding when blast radius or organizational readiness is uncertain. Delay production when critical observability, security, or recovery controls are absent.

## Common failure patterns
Equating setup with readiness, skipping ownership, ignoring non-production testing, and leaving support processes undefined.

## Verification
Confirm agreed readiness gates are satisfied with evidence and that operators can explain normal, degraded, and escalation procedures.

## Expected output
A completed onboarding record with validated prerequisites, readiness evidence, owners, risks, and post-launch plan.

## Stop conditions
Stop when a critical prerequisite is unmet, production risk is unaccepted, or required approvals are missing.