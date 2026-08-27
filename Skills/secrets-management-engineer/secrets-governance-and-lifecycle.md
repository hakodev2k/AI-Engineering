# Secrets Governance and Lifecycle

## Purpose
Establish ownership, standards, review cadence, lifecycle expectations, and measurable controls so secrets management remains effective after initial implementation.

## When to use
Use when defining enterprise secrets standards, auditing maturity, onboarding teams, or reducing unmanaged credentials at scale.

## Inputs
- Secret inventory and classification
- Organizational ownership model
- Security and compliance requirements
- Platform capabilities
- Existing policy exceptions

## Context to inspect
Inspect secret ages, owners, rotation records, exception registers, orphaned credentials, policy reviews, platform adoption, incident history, and access-review evidence.

## Core knowledge
Governance must convert security intent into enforceable lifecycle rules. Important dimensions include ownership, approved storage, maximum lifetime, rotation responsibility, access review, exception expiry, evidence retention, and decommissioning.

## Procedure
1. Define secret classes and mandatory controls for each class.
2. Assign accountable owners to secret-producing systems and platforms.
3. Establish approved stores and prohibited storage patterns.
4. Define maximum lifetimes, rotation expectations, and revocation SLAs.
5. Require least-privilege access reviews and separation of duties where warranted.
6. Define exception criteria, approvers, compensating controls, and expiry dates.
7. Establish onboarding and decommission procedures.
8. Measure orphaned secrets, stale credentials, rotation compliance, exposed-secret findings, and platform adoption.
9. Review incidents and operational failures for policy changes.
10. Automate enforceable controls and periodically sample evidence for correctness.

## Decision points
Apply stricter controls to secrets with high privilege, external usability, long lifetime, or large blast radius. Use exceptions for genuine constraints, not as permanent substitutes for remediation.

## Common failure patterns
- Policies with no accountable owner
- Rotation standards that ignore application limitations
- Permanent exceptions
- Counting stored secrets without measuring risk
- Decommissioned applications leaving active credentials
- Governance based solely on annual manual audits

## Verification
Sample secrets from each class and prove ownership, approved storage, access control, rotation evidence, exception status, and decommission handling. Reconcile metrics against authoritative stores rather than self-reported spreadsheets.

## Expected output
A practical secrets governance model with enforceable standards, lifecycle ownership, exception handling, metrics, and periodic assurance.

## Stop conditions
Stop and escalate when policy ownership is unresolved, required controls cannot be technically enforced for high-risk secrets, or exceptions create unacceptable unmanaged exposure.