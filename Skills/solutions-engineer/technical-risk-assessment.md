# Technical Risk Assessment

## Purpose
Identify, quantify, and reduce technical uncertainties that could invalidate solution feasibility, delivery, security, or operations.

## When to use
Use during discovery, architecture review, evaluation planning, and before production commitment.

## Inputs
Architecture, requirements, assumptions, dependencies, evidence, timelines, organizational constraints.

## Context to inspect
Novel components, unsupported integrations, scale assumptions, migration steps, security gaps, operational maturity, and external dependencies.

## Core knowledge
Risk combines likelihood, impact, detectability, and uncertainty. Senior practice distinguishes known limitations from assumptions that require evidence.

## Procedure
1. Enumerate architecture and delivery assumptions.
2. Identify failure or uncertainty associated with each.
3. Estimate impact and likelihood using available evidence.
4. Rank risks by decision significance.
5. Define mitigation, validation, transfer, or acceptance strategy.
6. Assign owners and deadlines.
7. Reassess after experiments or design changes.
8. Escalate residual risks explicitly.

## Decision points
Validate high-uncertainty/high-impact risks early. Accept low-impact risks when mitigation cost exceeds expected harm.

## Common failure patterns
Risk lists without owners, optimistic likelihood estimates, confusing issues with risks, and burying unsupported assumptions.

## Verification
Top risks have evidence, owners, actions, and explicit residual status.

## Expected output
A prioritized technical risk register tied to decisions.

## Stop conditions
Stop and escalate when a critical risk has no credible mitigation or validation path.