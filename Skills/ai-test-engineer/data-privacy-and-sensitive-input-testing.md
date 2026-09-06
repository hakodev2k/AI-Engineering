# Data Privacy and Sensitive Input Testing

## Purpose
Verify that AI workflows handle personal, confidential, regulated, and tenant-scoped information according to defined privacy and data-handling requirements.

## When to use
Use when prompts, retrieval, memory, telemetry, model providers, tools, or generated outputs may contain sensitive data.

## Inputs
Data classification, retention rules, provider terms/configuration, architecture, logging policy, tenant model, and privacy requirements.

## Preconditions
Authoritative data-handling requirements and approved synthetic or test data are available.

## Context to inspect
Inspect ingestion, prompts, model requests, retrieval filters, caches, logs, traces, analytics, memory stores, exports, backups, and deletion paths.

## Core knowledge
Sensitive data can leak through prompts, outputs, logs, embeddings, caches, evaluation datasets, or cross-tenant retrieval. Testing must follow data through the entire lifecycle, not only the model API call.

## Procedure
1. Map sensitive data sources and processing paths.
2. Use synthetic markers to trace information through the system.
3. Verify minimization before model/provider transmission.
4. Test tenant and user isolation in retrieval and memory.
5. Inspect logs, traces, error reports, and analytics for unintended capture.
6. Verify masking/redaction behavior and its failure modes.
7. Test retention and deletion workflows where applicable.
8. Verify exports and debugging tools respect access controls.
9. Test fallback providers for equivalent privacy guarantees.
10. Record unresolved data flows and ownership.

## Decision points
Prefer synthetic data for routine tests. Use real sensitive data only with explicit approval and controls. Block a fallback path when its privacy posture is weaker than the primary path.

## Common failure patterns
Testing only API payloads, forgetting logs and embeddings, weak tenant filters, assuming redaction is perfect, and keeping evaluation copies after source deletion.

## Verification
Confirm synthetic markers appear only in approved stores and channels, tenant boundaries hold, and retention/deletion behavior matches policy.

## Expected output
A privacy test report with data-flow evidence, leakage findings, isolation results, and required remediation.

## Stop conditions
Stop when data classification is unknown, real sensitive data lacks approval, or a discovered leak requires privacy/security escalation.