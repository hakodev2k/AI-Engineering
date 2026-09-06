# Privacy and Sensitive Data Controls

## Purpose
Prevent inappropriate collection, indexing, retrieval, logging, or model exposure of personal, confidential, or regulated information in AI knowledge systems.

## When to use
Use when onboarding sensitive sources, processing user-generated content, changing telemetry, or reviewing a knowledge platform for privacy risk.

## Inputs
Data classifications, source schemas, privacy requirements, retention rules, redaction policies, model/data processor contracts, and logging design.

## Context to inspect
Inspect raw ingestion, normalized content, metadata, embeddings, caches, logs, prompts, analytics, exports, and deletion flows.

## Core knowledge
Sensitive information can leak through raw text, metadata, logs, caches, and derived representations. Minimization should occur as early as practical. Embeddings are derived data and should be governed according to the sensitivity of their source and realistic extraction risk.

## Procedure
1. Classify source fields and content by sensitivity and purpose.
2. Remove data that is unnecessary for supported knowledge tasks.
3. Define redaction, masking, pseudonymization, or exclusion rules.
4. Apply controls before indexing when possible.
5. Prevent sensitive fields from entering prompts, logs, metrics labels, or debug traces unless explicitly required and protected.
6. Align retention and deletion across raw, normalized, indexed, cached, and derived artifacts.
7. Validate processor and model-provider data handling settings.
8. Restrict access to sensitive troubleshooting data.
9. Test representative and adversarial sensitive-data cases.
10. Document residual risk and required approvals.

## Decision points
Prefer exclusion over redaction when sensitive content has no retrieval value. Use reversible pseudonymization only when re-identification is an explicit authorized requirement.

## Common failure patterns
Redacting only display output, logging full prompts, retaining embeddings after source deletion, treating metadata as non-sensitive, and sending restricted content to external models without review.

## Verification
Trace sample sensitive records end-to-end, verify deletion propagation, scan logs and indexes, and test that redacted fields cannot be retrieved through alternate query paths.

## Expected output
A privacy control map covering minimization, transformation, retention, deletion, model exposure, and verification evidence.

## Stop conditions
Stop when lawful purpose is unclear, required processor guarantees are unavailable, or sensitive content cannot be isolated to an acceptable risk level.