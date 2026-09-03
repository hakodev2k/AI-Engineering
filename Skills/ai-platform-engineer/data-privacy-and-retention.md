# Data Privacy and Retention

## Purpose
Design platform controls for sensitive data sent to models, retrieval systems, logs, evaluation stores, and third-party providers.

## When to use
Use when onboarding new data classes, providers, regions, telemetry, evaluation datasets, or retention workflows.

## Inputs
- Data classifications
- Privacy and regulatory requirements
- Provider data-use terms
- Retention requirements
- Regional constraints

## Context to inspect
Inspect prompts, outputs, embeddings, vector indexes, traces, caches, evaluation datasets, provider retention settings, backup policies, and deletion paths.

## Core knowledge
AI platforms replicate data across more surfaces than ordinary APIs: prompts, responses, embeddings, retrieval caches, traces, judge inputs, and provider logs. Retention and deletion therefore require an end-to-end inventory. Embeddings may remain sensitive even when original text is removed.

## Procedure
1. Map data flows across every platform component and provider.
2. Classify input, output, derived data, and telemetry separately.
3. Define permitted providers and regions for each class.
4. Minimize payloads before external transmission.
5. Configure provider retention and training-use settings according to policy.
6. Define storage encryption and access boundaries.
7. Define retention periods for logs, traces, evaluations, caches, and indexes.
8. Implement deletion propagation across derived stores where required.
9. Redact or tokenize sensitive fields before telemetry capture.
10. Test data-subject or administrative deletion workflows.
11. Audit backups and disaster-recovery copies.
12. Review data flows whenever platform capabilities change.

## Decision points
Prefer no-content telemetry when metadata is sufficient. Store raw content only when its operational value outweighs privacy risk and approved controls exist. Use regional processing when residency requirements demand it.

## Common failure patterns
Deleting source records but retaining embeddings, logging full prompts by default, inconsistent provider settings, forgotten evaluation copies, indefinite cache retention, and no ownership for deletion verification.

## Verification
Verify data-flow documentation against runtime behavior, provider settings, access controls, redaction tests, retention jobs, and end-to-end deletion evidence.

## Expected output
An auditable data-handling model with classification, minimization, residency, retention, deletion, and provider controls.

## Stop conditions
Stop when provider data terms are unclear, residency requirements cannot be met, or deletion obligations cannot be implemented across required stores.