# Identity Governance

## Purpose
Establish ownership, policy, lifecycle, evidence, and decision processes that keep identity and access controls effective over time.

## When to use
Use for IAM governance programs, application onboarding, audit remediation, entitlement sprawl, or fragmented identity ownership.

## Inputs
Identity systems, applications, policies, control requirements, entitlement catalogs, owners, lifecycle processes, review evidence, and risk register.

## Context to inspect
Inspect identity ownership, application ownership, entitlement ownership, exception processes, access reviews, lifecycle SLAs, policy enforcement, and audit findings.

## Core knowledge
IAM governance connects technical access controls to accountable business decisions. Automation without ownership scales mistakes; ownership without reliable data produces weak attestations.

## Procedure
1. Define governance scope and security objectives.
2. Assign accountable owners for identity sources, applications, and entitlements.
3. Establish minimum onboarding standards.
4. Define access request, review, lifecycle, and exception policies.
5. Classify sensitive and privileged access.
6. Define evidence and retention requirements.
7. Measure lifecycle timeliness, orphaning, exceptions, review quality, and privileged exposure.
8. Create remediation paths for noncompliant applications.
9. Review policy effectiveness periodically.
10. Retire obsolete identities, entitlements, connectors, and exceptions.

## Decision points
Centralize standards and evidence, but delegate business access decisions to informed owners. Automate deterministic controls while retaining accountable decisions for material risk.

## Common failure patterns
Governance as audit paperwork, no entitlement owners, indefinite exceptions, metrics based only on completed tasks, onboarding without offboarding, and controls that cannot prove effective access.

## Verification
Sample applications end to end and verify ownership, lifecycle, request, review, exception, and evidence requirements are actually operating.

## Expected output
A practical IAM governance model with ownership, policies, metrics, evidence, exceptions, and remediation mechanisms.

## Stop conditions
Escalate when accountable ownership cannot be assigned or required evidence cannot be produced from authoritative systems.