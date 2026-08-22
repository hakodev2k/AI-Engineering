# Product Security and Privacy Decisions

## Purpose
Integrate security and privacy constraints into product decisions early enough to avoid unsafe defaults, costly redesign, and inappropriate data use.

## When to use
Use for authentication, permissions, personal data, analytics, sharing, exports, integrations, AI features, and sensitive workflows.

## Inputs
User journey, data categories, actors, permissions, retention needs, security guidance, privacy requirements, and business purpose.

## Context to inspect
Inspect what data is collected, why it is needed, who can access it, where it flows, retention, deletion, consent, auditability, and abuse potential.

## Core knowledge
Product Owners should apply data minimization, least privilege, safe defaults, purpose limitation, and explicit user expectations while relying on security/privacy specialists for authoritative interpretation.

## Procedure
1. Identify sensitive actions and data.
2. State the legitimate product purpose for collection or access.
3. Minimize data and permissions to what is necessary.
4. Define actors and authorization expectations.
5. Consider misuse, accidental disclosure, and recovery.
6. Define retention, deletion, export, and audit expectations.
7. Review consent and user transparency where applicable.
8. Engage specialists for high-risk decisions.
9. Add testable acceptance and monitoring requirements.
10. Reassess when scope or data flow changes.

## Decision points
Prefer less data and narrower access when product value is comparable. Require stronger review for irreversible exposure, privileged actions, or regulated data.

## Common failure patterns
Collecting data for possible future use, confusing authentication with authorization, broad admin permissions, hidden retention, and treating privacy review as a release gate only.

## Verification
Data purpose, access, lifecycle, and abuse controls are explicit and specialist approvals exist where required.

## Expected output
Product requirements that embed appropriate security and privacy boundaries.

## Stop conditions
Stop and escalate when legal basis, regulatory interpretation, breach risk, or security architecture requires qualified approval.