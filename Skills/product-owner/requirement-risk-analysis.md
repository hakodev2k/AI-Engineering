# Requirement Risk Analysis

## Purpose
Identify ambiguity, hidden assumptions, compliance concerns, operational impact, and costly failure modes before requirements become implementation commitments.

## When to use
Use for high-impact features, integrations, financial workflows, permissions, data changes, migrations, and unfamiliar domains.

## Inputs
Requirement, business rules, user journey, architecture context, policies, dependencies, and known incidents.

## Context to inspect
Inspect affected actors, data, permissions, state transitions, failure behavior, external contracts, reversibility, and operational support.

## Core knowledge
Requirement risk is broader than technical complexity. Consider user harm, business loss, legal exposure, irreversibility, ambiguity, dependency uncertainty, and observability.

## Procedure
1. Clarify intended outcome and affected users.
2. Enumerate assumptions and ambiguous terms.
3. Identify sensitive data and privileged actions.
4. Map critical state transitions and irreversible effects.
5. Identify external and cross-team dependencies.
6. Consider misuse, failure, partial completion, and recovery.
7. Rank risks by impact and uncertainty.
8. Add discovery, controls, acceptance criteria, or rollout safeguards.
9. Assign unresolved decisions to owners.
10. Reassess after technical refinement.

## Decision points
Use deeper discovery for high-uncertainty/high-impact work; use incremental rollout for reversible uncertainty; require explicit approval for material compliance or financial risk.

## Common failure patterns
Focusing only on happy paths, assuming requirements are authoritative, ignoring recovery, treating edge cases as QA-only concerns, and hiding risk inside estimates.

## Verification
High-impact failure modes have acceptance or mitigation, assumptions are visible, and unresolved risks have owners.

## Expected output
A requirement risk assessment with mitigations, open decisions, and verification needs.

## Stop conditions
Escalate when legal, security, privacy, financial, or safety interpretation exceeds Product Owner authority.