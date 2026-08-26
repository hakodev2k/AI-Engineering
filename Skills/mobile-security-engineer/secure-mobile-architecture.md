# Secure Mobile Architecture

## Purpose
Design mobile boundaries so compromise of a component or device state does not expose sensitive capabilities or data.

## When to use
Use for architecture design, major refactoring, privileged features, or security review.

## Inputs
Requirements, threat model, platform targets, backend contracts, identity model, data classification, dependency inventory.

## Preconditions
Understand current architecture and trust assumptions from evidence.

## Context to inspect
Modules, process boundaries, backend enforcement, storage, networking, OS APIs, WebViews, native bridges, SDKs, and build variants.

## Core knowledge
Mobile clients operate in attacker-controlled environments. Minimize secrets and authority on-device, isolate sensitive operations, enforce authorization server-side, use least privilege, fail closed, and reduce attack surface.

## Procedure
1. Classify assets and privileged operations.
2. Identify boundaries and security-critical modules.
3. Remove unnecessary client authority.
4. Define secure component interfaces.
5. Minimize permissions and exposed components.
6. Centralize security-sensitive policy where appropriate.
7. Define safe failure and recovery behavior.
8. Add privacy-safe observability.
9. Document security invariants.
10. Validate architecture against abuse cases.

## Decision points
Choose platform primitives over custom security code. Separate components when isolation materially reduces blast radius. Keep enforcement on the backend when client integrity cannot be guaranteed.

## Common failure patterns
Trusting UI state as authorization, embedding privileged secrets, oversized permissions, inconsistent duplicated security logic, implicit component exposure, and omitting external SDKs from architecture.

## Verification
Trace sensitive operations end-to-end and demonstrate that bypassing client UI or local state cannot grant unauthorized backend actions.

## Expected output
Documented architecture with explicit trust boundaries, security invariants, least-privilege interfaces, and validation evidence.

## Stop conditions
Escalate when controls depend on undocumented backend behavior, unsupported platform guarantees, or unacceptable residual risk.