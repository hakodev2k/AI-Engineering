# Data Privacy and Governance

## Purpose
Handle prompts, training data, retrieved content, traces, and model outputs according to privacy, retention, residency, and governance requirements.

## When to use
Use when AI workflows touch personal, confidential, regulated, proprietary, or cross-region data.

## Inputs
Data classification, provider terms, retention policy, region requirements, consent/legal basis, logging design, access model.

## Preconditions
Know what data classes exist and which systems/providers may process each class.

## Context to inspect
Prompt payloads, telemetry, RAG stores, embeddings, fine-tuning datasets, backups, caches, support tooling, provider data-use settings.

## Core knowledge
AI pipelines multiply data copies. Embeddings, logs, eval datasets, and traces can remain sensitive even when they are not raw source documents. Apply minimization, purpose limitation, access control, retention, deletion, and provenance end to end.

## Procedure
1. Inventory data entering and leaving each AI stage.
2. Classify sensitivity and permitted processing locations.
3. Minimize fields before sending data to models.
4. Redact or tokenize sensitive values where practical.
5. Configure provider retention/training settings explicitly.
6. Restrict access to prompts, traces, vector stores, and datasets.
7. Define retention and deletion flows for all derived artifacts.
8. Track dataset/source provenance and consent constraints.
9. Test deletion and access-control behavior.
10. Review changes when providers, regions, or data purposes change.

## Decision points
Prefer local/private processing when policy prohibits external processing. Avoid logging full payloads when metadata or sampled redacted traces are sufficient.

## Common failure patterns
Logging everything, assuming embeddings are anonymous, retaining eval datasets forever, unclear provider settings, and forgetting caches/backups during deletion.

## Verification
Perform data-flow review, access tests, retention/deletion tests, and provider-configuration checks.

## Expected output
A documented compliant data flow with minimization, retention, access, and deletion controls.

## Stop conditions
Stop when data classification, processing authority, or provider handling terms are unknown.