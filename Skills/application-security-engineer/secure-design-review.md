# Secure Design Review

## Purpose
Evaluate a proposed system design before expensive implementation decisions become difficult to reverse.

## When to use
Use for new services, security-sensitive features, identity flows, multi-tenant designs, payment or administrative workflows, and major integration changes.

## Inputs
Requirements, diagrams, API contracts, threat model, data classification, deployment model, NFRs, and proposed dependencies.

## Context to inspect
Inspect existing architectural conventions, security controls, tenant boundaries, failure modes, operational ownership, and backward-compatibility requirements. Do not assume the proposal reflects production reality.

## Core knowledge
Secure design minimizes attack surface, privilege, implicit trust, sensitive state, and irreversible failure. Controls must survive partial failure and hostile inputs. Security properties should be explicit and testable.

## Procedure
1. Define protected assets and required security properties.
2. Identify trust boundaries, identities, privileges, and sensitive state transitions.
3. Review authentication, authorization, tenancy, secrets, encryption, validation, and auditability.
4. Examine failure behavior, retries, rollback, race conditions, and degraded modes.
5. Review external dependencies and supply-chain assumptions.
6. Check administrative and recovery paths, not only happy paths.
7. Compare alternatives and document security/cost/complexity trade-offs.
8. Convert findings into concrete design changes or accepted risks.
9. Define testable acceptance criteria.
10. Record unresolved decisions in an ADR or equivalent artifact.

## Decision points
Choose centralized controls when consistency dominates; local controls when domain context is required. Prefer deny-by-default for privileged operations. Introduce cryptography only when the threat model requires it and key lifecycle can be operated safely.

## Common failure patterns
Security added after design freeze, vague recommendations, excessive reliance on network location, missing recovery-path authorization, and controls that cannot be tested.

## Verification
Confirm revised diagrams/contracts incorporate approved changes and acceptance criteria map to tests or operational evidence.

## Expected output
A review with risks, decisions, required changes, residual risk, and verification plan.

## Stop conditions
Stop and escalate for unresolved critical trust assumptions, missing owners, prohibited data handling, or risk acceptance beyond the reviewer's authority.