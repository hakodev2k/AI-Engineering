# Formal Security Properties

## Purpose
Express and verify security guarantees such as authorization, confidentiality boundaries, integrity, isolation, noninterference, freshness, and protocol invariants with precise assumptions.

## When to use
Use for access-control systems, security protocols, privilege boundaries, multi-tenant isolation, key-management workflows, and high-impact authorization logic.

## Inputs
Threat model, trust boundaries, principals, assets, attacker capabilities, protocol/system model, security requirements, and failure assumptions.

## Preconditions
Attacker capabilities and trusted components must be explicit.

## Context to inspect
Authentication, authorization decisions, credential lifecycle, replay protections, side channels within scope, administrative paths, recovery flows, and cross-tenant state.

## Core knowledge
Security properties are relative to a threat model. Integrity and confidentiality often require relational reasoning across executions, while authentication protocols require freshness and binding guarantees. A proof with an unrealistically weak attacker is not useful assurance.

## Procedure
1. Define protected assets and security principals.
2. State attacker capabilities and trust assumptions.
3. Define authorization and information-flow boundaries.
4. Encode integrity, secrecy, freshness, replay, or isolation properties as appropriate.
5. Model compromise and recovery states that are in scope.
6. Include administrative and exceptional paths.
7. Check confused-deputy and privilege-escalation scenarios.
8. Analyze counterexamples against the threat model.
9. Map formal properties to implementation enforcement points.
10. Re-evaluate proofs when trust boundaries or attacker capabilities change.

## Decision points
Use trace properties for event ordering and authorization; use relational/noninterference methods when the claim concerns what one execution can reveal about another secret input.

## Common failure patterns
Weak attacker models, omitted admin paths, assuming authenticated means authorized, ignoring replay, proving secrecy while leaking through modeled outputs, and unreviewed trusted code.

## Verification
Challenge properties with adversarial traces, mutate authorization rules, inspect assumptions, and ensure known attack scenarios are rejected.

## Expected output
A formal threat model, security properties, verification evidence, trusted-base inventory, and residual risks.

## Stop conditions
Stop when attacker capabilities are disputed, critical trust assumptions are unverifiable, or the model excludes a known material attack path.