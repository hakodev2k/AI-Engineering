# AI Change Management

## Purpose
Control changes to AI behavior so technical, product, safety, compliance, and operational stakeholders understand what is changing and why.

## When to use
Use for model swaps, prompt changes, routing changes, retrieval updates, fine-tunes, tool additions, policy controls, and major infrastructure changes.

## Inputs
Change request, rationale, owners, affected systems, evaluation evidence, rollout plan, risk assessment.

## Preconditions
The proposed change is bounded and attributable.

## Context to inspect
Architecture, previous decisions, incident history, current baselines, dependency contracts, approval policy, and customer commitments.

## Core knowledge
AI behavior may change without code changes. Change management therefore covers data, models, prompts, provider settings, retrieval corpora, tool permissions, and operational policies.

## Procedure
1. Define the change and intended outcome.
2. Identify affected user journeys and system boundaries.
3. Compare against current baseline behavior.
4. Identify required reviewers and approvers.
5. Document risks, rollback, and monitoring.
6. Link evaluation evidence and compatibility checks.
7. Schedule or sequence dependent changes.
8. Prevent unrelated changes from entering the same release when diagnosis would become ambiguous.
9. Record final approval and release owner.
10. Preserve the change record with the release manifest.

## Decision points
Split changes when independent rollback or diagnosis matters. Bundle only when artifacts are inseparable or compatibility requires atomic release.

## Common failure patterns
Untracked console changes, mixed unrelated updates, unclear ownership, missing behavioral baseline, and approvals based on intuition rather than evidence.

## Verification
Confirm every production-affecting artifact maps to an approved change record and intended release.

## Expected output
A traceable change record with scope, evidence, approvals, rollout, and rollback requirements.

## Stop conditions
Stop when change ownership, risk authority, or intended behavior is materially unclear.