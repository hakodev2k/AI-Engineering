# Privacy-Aware Data Science

## Purpose
Minimize privacy risk throughout analytical and modeling work while preserving necessary utility and respecting governance requirements.

## When to use
Use whenever work involves personal, sensitive, behavioral, location, financial, health, or linkable individual-level data.

## Inputs
Data inventory, purpose, lawful/approved use, retention rules, access model, outputs, and sharing requirements.

## Context to inspect
Identifiers, quasi-identifiers, joins, small cohorts, raw text, free-form fields, export paths, notebooks, and third-party services.

## Core knowledge
De-identification is contextual; combinations of attributes can re-identify people. Data minimization, purpose limitation, least privilege, aggregation, retention control, and disclosure review reduce risk. Privacy-preserving techniques have utility trade-offs.

## Procedure
1. Define the minimum data needed for the approved purpose.
2. Classify sensitive fields and linkability risks.
3. Remove unnecessary direct identifiers early.
4. Restrict access and avoid uncontrolled local copies.
5. Aggregate or transform data when individual detail is unnecessary.
6. Review small-cell and output disclosure risks.
7. Use approved environments and external services only.
8. Apply retention and deletion requirements.
9. Document data use, transformations, and sharing.
10. Escalate novel or high-risk uses for privacy review.

## Decision points
Prefer aggregation over individual records when sufficient. Consider privacy-enhancing methods only when threat model and utility justify them.

## Common failure patterns
Assuming hashed IDs are anonymous, exporting raw data for convenience, leaking individuals through small groups, and reusing data beyond its approved purpose.

## Verification
Audit fields, access, exports, retention, and output disclosure against applicable policy and approvals.

## Expected output
A data-science workflow with minimized exposure and documented privacy controls.

## Stop conditions
Stop when authorization, lawful basis, required consent, or privacy approval is unclear for sensitive processing.