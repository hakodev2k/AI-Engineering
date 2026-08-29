# Vendor and External Partner Management

## Purpose
Manage technical delivery dependencies involving vendors, partners, cloud providers, consultants, or external service owners with explicit contracts, evidence, and escalation paths.

## When to use
Use when program success depends on organizations outside direct management control.

## Inputs
Contracts, statements of work, technical interfaces, SLAs, milestones, support terms, escalation contacts, dependency requirements.

## Context to inspect
Commercial commitments, security reviews, legal constraints, integration history, support tickets, architecture, and exit options.

## Core knowledge
External commitments must be translated into verifiable technical deliverables. Senior TPMs separate contractual language from operational reality and maintain contingency for dependencies they cannot control directly.

## Procedure
1. Define the exact external capability or deliverable required.
2. Map contract commitments to technical acceptance criteria.
3. Establish named contacts and escalation paths on both sides.
4. Track lead times, environment access, security approvals, and integration prerequisites.
5. Validate milestones with evidence rather than verbal confidence.
6. Record deviations and impact immediately.
7. Maintain fallback, substitution, or delay scenarios for critical dependencies.
8. Escalate commercial or legal gaps through appropriate owners.

## Decision points
Build internally when external lead time, lock-in, risk, or integration cost exceeds value. Use contractual escalation only after technical facts and obligations are clear.

## Common failure patterns
Treating vendor dates as guaranteed, unclear acceptance criteria, no escalation route, hidden lock-in, and assuming support SLAs equal resolution times.

## Verification
Confirm each critical external dependency has a documented commitment, testable acceptance evidence, owner, and contingency.

## Expected output
A controlled external-dependency plan with measurable obligations and escalation readiness.

## Stop conditions
Escalate when contractual terms conflict with technical needs, security approval is missing, or no feasible contingency exists for a critical dependency.