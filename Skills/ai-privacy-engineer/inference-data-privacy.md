# Inference Data Privacy

## Purpose
Protect personal and sensitive information during live AI inference by controlling what enters prompts, tools, retrieval systems, traces, model providers, and generated outputs.

## When to use
Use when integrating LLMs or ML APIs, adding personalization, enabling tool use, exposing user documents to RAG, or changing inference logging.

## Inputs
- Request/response contracts
- Prompt templates and tool schemas
- RAG architecture
- Provider settings and data-use terms
- Logging and observability configuration
- User privacy requirements

## Context to inspect
Inspect application code that constructs prompts, middleware, model SDK settings, tool-call payloads, retrieval results, caches, traces, logs, error reports, and output persistence.

## Core knowledge
Inference privacy depends on strict data scoping, provider behavior, purpose limitation, tenant isolation, output controls, and retention. Prompt data may be replicated into telemetry or error systems even when application storage is disabled.

## Procedure
1. Trace the complete inference request path.
2. Identify all personal and sensitive fields.
3. Remove data not required for the model task.
4. Redact or tokenize identifiers when semantics permit.
5. Scope retrieval to the authenticated user or tenant.
6. Validate provider retention and training-use settings.
7. Prevent sensitive fields from entering generic logs or traces.
8. Define output handling and persistence rules.
9. Add authorization before every data-bearing tool call.
10. Test cross-session and cross-tenant isolation.
11. Add leakage detection for high-risk outputs where appropriate.
12. Document residual privacy risk and monitoring.

## Decision points
Use local inference when provider disclosure is unacceptable and operational constraints permit it. Prefer deterministic pre-processing for redaction over expecting the model to self-censor. Persist prompts only when a justified debugging or product need outweighs privacy exposure.

## Common failure patterns
- Logging full prompts by default
- Passing entire documents instead of required excerpts
- Trusting client-supplied tenant identifiers
- Enabling provider data retention unintentionally
- Allowing tool calls to bypass authorization
- Assuming encrypted transport solves privacy risk

## Verification
Inspect representative provider payloads, traces, and logs; run tenant-isolation tests; validate retention configuration; and verify that sensitive fields are absent where prohibited.

## Expected output
A verified inference privacy design with minimized payloads, scoped retrieval, safe logging, provider controls, authorization checks, and output-handling rules.

## Stop conditions
Escalate when provider behavior is unknown, sensitive payloads cannot be minimized or protected, tenant isolation is unverified, or required logging conflicts with privacy requirements.