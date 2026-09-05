# Audit Readiness and Evidence Management

## Purpose
Maintain reliable, reviewable compliance evidence so AI governance controls can be demonstrated without emergency document collection before an audit.

## When to use
Use for internal audits, customer assurance, regulatory inquiries, certifications, board reporting, or periodic control reviews.

## Inputs
Control matrix, approval records, assessments, test results, logs, model documentation, vendor evidence, incident records, exception register.

## Preconditions
Evidence owners and retention requirements are defined.

## Context to inspect
Document repositories, ticketing systems, model registries, audit stores, access controls, evidence indexes, prior audit findings.

## Core knowledge
Good evidence is current, attributable, tamper-resistant where necessary, scoped to the correct system/version, and directly linked to a control objective. Screenshots and manual attestations are weaker than system-generated records when stronger evidence is available.

## Procedure
1. Map every critical control to required evidence.
2. Define evidence source, owner, frequency, and retention.
3. Prefer automatically generated artifacts where possible.
4. Bind evidence to exact system and model versions.
5. Restrict access to sensitive evidence.
6. Check completeness on a recurring cadence.
7. Reconcile evidence with exceptions and incidents.
8. Run mock audit sampling.
9. Remediate stale, ambiguous, or unverifiable artifacts.
10. Maintain a concise evidence index for reviewers.

## Decision points
Use representative sampling only when the control population is well-defined. Preserve raw evidence when summaries would remove facts needed for independent verification.

## Common failure patterns
Evidence gathered only before audits, screenshots without timestamps or scope, stale policy documents, missing version linkage, and evidence stored by individuals rather than controlled systems.

## Verification
Select random controls and confirm an independent reviewer can locate sufficient evidence to reproduce the compliance conclusion.

## Expected output
An audit-ready evidence catalog with control links, owners, retention, access restrictions, freshness status, and identified gaps.

## Stop conditions
Escalate when mandatory evidence is unavailable, integrity is questionable, or retention/access rules prevent required review.