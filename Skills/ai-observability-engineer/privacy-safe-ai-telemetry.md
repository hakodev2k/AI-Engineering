# Privacy-Safe AI Telemetry

## Purpose
Design telemetry that supports AI debugging while minimizing collection of prompts, outputs, personal data, secrets, and proprietary context.

## When to use
Use before adding AI logs/traces, enabling payload capture, or expanding telemetry retention.

## Inputs
Data classification, privacy/security requirements, telemetry schema, retention policy, debugging needs, and access controls.

## Context to inspect
Inspect prompt construction, tool payloads, retrieved documents, user identifiers, provider logs, telemetry vendors, sampling, and deletion workflows.

## Core knowledge
AI payloads frequently contain sensitive or unstructured data. Data minimization, purpose limitation, redaction, access control, retention, and auditability should be designed before collection. Hashing is not anonymization when inputs are guessable.

## Procedure
1. Classify every proposed telemetry field by sensitivity and diagnostic purpose.
2. Remove fields without a clear operational need.
3. Prefer counts, lengths, enums, hashes with appropriate threat analysis, or surrogate IDs over raw content.
4. Redact secrets and structured identifiers before export.
5. Separate restricted debugging payload stores from ordinary observability stores when payload capture is approved.
6. Apply least-privilege access and short retention to sensitive telemetry.
7. Verify deletion and subject-data workflows where applicable.
8. Test redaction with adversarial examples and nested tool payloads.
9. Document residual risks and approved exceptions.

## Decision points
Use opt-in sampled payload capture only when metadata cannot answer the diagnostic need. Keep sensitive payloads out of metrics entirely.

## Common failure patterns
Raw prompts in spans, API keys in tool arguments, reversible identifiers, broad dashboard access, indefinite retention, and assuming vendor encryption solves data minimization.

## Verification
Run a seeded sensitive-data test and prove prohibited values never reach ordinary logs, metrics, or traces.

## Expected output
Approved telemetry schema, redaction controls, access/retention policy, and leakage-test evidence.

## Stop conditions
Stop and escalate when legal/privacy classification is unresolved or a requested capture conflicts with policy.