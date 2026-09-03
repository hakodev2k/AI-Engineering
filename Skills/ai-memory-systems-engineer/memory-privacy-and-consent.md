# Memory Privacy and Consent

## Purpose
Ensure persistent AI memory respects user consent, purpose limitation, minimization, access controls, and data-subject rights.

## When to use
Use when storing personal, behavioral, conversational, or inferred information across sessions.

## Inputs
Privacy policy, consent model, memory taxonomy, data classifications, retention rules, user controls, regulatory requirements.

## Preconditions
Identify sensitive categories and lawful or policy-approved purposes for storage.

## Context to inspect
Write paths, extraction prompts, stores, logs, backups, embeddings, caches, exports, deletion workflows, and third-party processors.

## Core knowledge
Derived embeddings and summaries can still represent personal data. Consent and deletion must cover secondary representations, not only raw records.

## Procedure
1. Classify memory data by sensitivity.
2. Map each class to storage purpose and consent requirement.
3. Minimize fields and retention duration.
4. Prevent prohibited inference and collection.
5. Enforce access and tenant boundaries.
6. Propagate consent changes to extraction and retrieval.
7. Implement view, correction, export, and deletion paths.
8. Track downstream copies and indexes.
9. Test deletion and revocation end to end.
10. Document residual retention such as legally required audit records.

## Decision points
Prefer not storing information when value is marginal. Use explicit opt-in for sensitive durable memory where policy requires it.

## Common failure patterns
Deleting source text but retaining embeddings; hidden inferred attributes; indefinite retention; consent checked only at write time.

## Verification
Run privacy test cases proving non-consented data is not stored or retrieved and deletion propagates to all material representations.

## Expected output
A memory privacy control model and validated lifecycle workflows.

## Stop conditions
Stop when storage purpose, consent authority, or deletion obligations are unresolved.