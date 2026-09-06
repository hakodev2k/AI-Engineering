# Release Gate Design

## Purpose
Design objective, risk-weighted release gates that prevent unsafe or low-quality AI changes from reaching users while avoiding brittle bureaucracy.

## When to use
Use when creating or revising promotion criteria for model, prompt, retrieval, policy, or inference-stack releases.

## Inputs
Product requirements, SLOs, risk taxonomy, evaluation metrics, incident history, compliance obligations, and deployment capabilities.

## Preconditions
Release classes and accountable owners can be defined.

## Context to inspect
Inspect current CI/CD, evaluation infrastructure, manual approvals, exception history, false-positive gate failures, and production regressions.

## Core knowledge
Good gates are measurable, attributable, reproducible, proportional to risk, and tied to user outcomes. A gate should block only on evidence that matters and should distinguish hard safety constraints from optimization targets.

## Procedure
1. Classify release types by blast radius and reversibility.
2. Identify mandatory quality, safety, security, performance, compatibility, and operational outcomes.
3. Define metrics, slices, thresholds, confidence requirements, and comparison baselines.
4. Separate hard blockers from warning thresholds.
5. Specify required evidence freshness and artifact identity.
6. Define exception authority, rationale, expiry, and compensating controls.
7. Automate deterministic checks where possible.
8. Keep high-judgment approvals explicit and auditable.
9. Test gates against historical good and bad releases.
10. Review gate effectiveness after incidents and false blocks.

## Decision points
Use relative regression gates when absolute targets vary by model family; use absolute minimums for non-negotiable constraints. Require manual approval when evidence cannot be reliably automated.

## Common failure patterns
Too many vanity metrics, thresholds tuned to one benchmark, no slice gates, permanent waivers, gates detached from exact artifacts, and blocking on noisy metrics without uncertainty handling.

## Verification
Replay historical releases through the gate set; confirm known regressions would be blocked and acceptable releases are not systematically rejected.

## Expected output
A documented gate matrix by release class with thresholds, evidence, owners, automation, and exception policy.

## Stop conditions
Stop if critical requirements lack measurable evidence, risk ownership is undefined, or gate changes would weaken mandatory controls without approval.
