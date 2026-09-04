# Data Subject Rights Engineering

## Purpose
Build technically reliable workflows for locating, exporting, correcting, restricting, and deleting personal data across AI systems when privacy-rights requests or equivalent user controls apply.

## When to use
Use when implementing user data access/export, deletion, correction, objection, restriction, or similar privacy-control workflows that touch AI datasets, embeddings, prompts, profiles, or model-derived data.

## Inputs
- Identity and account model
- Data-flow map and lineage
- Rights requirements supplied by privacy/legal stakeholders
- Storage and processor inventory
- Model-training and personalization architecture

## Context to inspect
Inspect primary databases, event stores, object storage, feature/vector stores, prompt histories, support tools, analytics, training datasets, checkpoints, backups, and vendors.

## Core knowledge
Rights workflows are identity-sensitive orchestration problems. They must find both raw and derived data without exposing another person's records, preserve auditability, handle asynchronous processors, and distinguish what can be corrected or deleted directly from what requires future retraining or suppression.

## Procedure
1. Define the supported request types and verified identity requirements.
2. Map each request type to affected data stores and processors.
3. Build canonical subject identifiers and safe lookup rules.
4. Prevent ambiguous identifiers from matching other individuals.
5. Orchestrate retrieval, export, correction, restriction, or deletion operations.
6. Include derived profiles, embeddings, personalization state, and prompt histories where applicable.
7. Propagate requests to approved third parties.
8. Handle immutable backups and trained-model implications explicitly.
9. Make workflows idempotent and resumable.
10. Record completion state without copying unnecessary personal content into audit logs.
11. Add timeout, retry, and exception handling.
12. Test edge cases such as merged accounts, deleted accounts, and identifier changes.

## Decision points
Use automated fulfillment for well-defined low-risk cases and route ambiguous identity or high-impact exceptions to manual review. Do not expose internal model artifacts as user data without first determining whether they can be meaningfully and safely linked to the requester.

## Common failure patterns
- Searching only the primary database
- Matching requests by weak identifiers
- Forgetting vector stores and derived profiles
- Exporting another user's data through account-linking errors
- Marking deletion complete before downstream processors finish
- Logging request payloads excessively

## Verification
Run end-to-end synthetic requests, verify every expected store and processor, test negative identity cases, inspect exported data for over-disclosure, and confirm idempotent retry behavior.

## Expected output
A rights-fulfillment workflow with identity controls, data-source coverage, orchestration, processor propagation, exception handling, and completion evidence.

## Stop conditions
Escalate when subject identity is ambiguous, data ownership cannot be established, model-level treatment is unresolved, or a processor cannot fulfill required actions.