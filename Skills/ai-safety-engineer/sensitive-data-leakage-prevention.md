# Sensitive Data Leakage Prevention

## Purpose
Prevent AI systems from exposing secrets, personal data, proprietary content, or cross-tenant information.

## When to use
Use for systems with retrieval, memory, user uploads, internal knowledge, logs, or tool access.

## Inputs
Data classifications, access model, prompt/context construction, retrieval configuration, logging, output channels.

## Context to inspect
Tenant boundaries, credentials, caches, embeddings, indexes, memory, debug traces, exports, and provider retention settings.

## Core knowledge
The safest secret is one the model never receives. Authorization must be enforced before retrieval and tool access, not inferred from generated text.

## Procedure
1. Map sensitive data entering model-accessible paths.
2. Remove unnecessary secrets from prompts and context.
3. Enforce identity and tenant filters before retrieval.
4. Scope service credentials minimally.
5. Redact or tokenize sensitive telemetry.
6. Define output checks for high-risk data classes.
7. Test cross-user and cross-tenant extraction attempts.
8. Test prompt-injection-assisted exfiltration.
9. Establish deletion and retention behavior.

## Decision points
Prefer pre-access authorization over post-generation filtering. Avoid model access entirely for secrets not required by the task.

## Common failure patterns
Shared vector indexes without filters; credentials in system prompts; full prompt logging; relying solely on output moderation.

## Verification
Demonstrate unauthorized identities cannot retrieve or cause disclosure of protected records across all access paths.

## Expected output
A data-leakage control design with tests and evidence.

## Stop conditions
Block release when cross-tenant access, secret exposure, or unbounded sensitive logging remains possible.