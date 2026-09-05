# Privacy and Data Leak Response

## Purpose
Respond to suspected sensitive-data disclosure through prompts, outputs, retrieval, logs, memory, training data, or tool integrations.

## When to use
Use for PII exposure, cross-tenant leakage, secret disclosure, memorization concerns, unauthorized retrieval, or sensitive logging.

## Inputs
Affected traces, data classification, users/tenants, storage locations, access logs, retention policy, model/provider data handling.

## Preconditions
Limit further exposure and preserve evidence under incident/legal policy.

## Context to inspect
Prompt logging, telemetry, RAG ACLs, memory stores, caches, model provider retention, fine-tuning data, secrets handling, output filters.

## Core knowledge
AI systems create additional disclosure paths through context assembly, logs, embeddings, model memory-like stores, provider requests, and generated outputs. Containment may require both application and data-governance action.

## Procedure
1. Stop the leaking pathway.
2. Classify exposed data and jurisdictions.
3. Identify source, recipients, duration, and copies.
4. Check provider and downstream retention.
5. Revoke exposed secrets or credentials.
6. Quarantine affected indexes, logs, or memory.
7. Coordinate required privacy/legal notification.
8. Remove data where policy permits and document exceptions.
9. Fix access controls or data minimization.
10. Run cross-tenant and sensitive-data regression tests.

## Decision points
Fail closed when authorization is uncertain. Treat credentials as compromised if exposure cannot be disproven.

## Common failure patterns
Focusing only on model output, forgetting logs/embeddings, deleting evidence before legal review, and assuming provider deletion is immediate.

## Verification
Leak path is closed, access tests pass, exposed secrets are rotated, and retention/removal actions are confirmed.

## Expected output
Exposure assessment, containment, data-handling actions, remediation, and verification record.

## Stop conditions
Escalate immediately for regulated or cross-tenant data.