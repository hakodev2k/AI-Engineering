# PII and Sensitive Data Guardrails

## Purpose
Prevent inappropriate collection, exposure, retention, propagation, and disclosure of sensitive data.

## When to use
Use for personal, confidential, regulated, credential, financial, health, or tenant-sensitive data.

## Inputs
Classification, flows, retention, access, prompts, retrieval, logs, vendors, consent.

## Context to inspect
Inspect ingestion, context, embeddings, caches, model requests, tools, memory, telemetry, exports, deletion.

## Core knowledge
Minimization/access control beat output redaction. Embeddings, logs, caches, and field combinations may remain sensitive.

## Procedure
1. Inventory sensitive fields.
2. Minimize exposure.
3. Authorize before retrieval.
4. Redact/tokenize early.
5. Keep secrets out of prompts/logs.
6. Check output authorization.
7. Define retention/deletion.
8. Test cross-user/tenant extraction.
9. Audit vendor boundaries.
10. Monitor leakage.

## Decision points
Prefer retrieval filtering; combine deterministic/semantic detection appropriately.

## Common failure patterns
Output-only redaction, unsafe embeddings, verbose traces, tenantless caches, credentials in context.

## Verification
Trace records end-to-end and prove unauthorized access/inference fails.

## Expected output
Sensitive-data controls and evidence.

## Stop conditions
Escalate cross-tenant exposure or retention/consent violations.