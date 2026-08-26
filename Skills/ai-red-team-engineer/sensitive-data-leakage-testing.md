# Sensitive Data Leakage Testing

## Purpose
Determine whether an AI system can expose secrets, personal data, proprietary context, hidden prompts, or data belonging to another principal.

## When to use
Use when models process confidential inputs, persistent memory, retrieval corpora, tool output, logs, or multi-tenant data.

## Inputs
Data classification, access model, prompt/context construction, storage design, logs, representative synthetic sensitive records, and retention rules.

## Context to inspect
Trace sensitive fields through ingestion, storage, model context, caches, telemetry, outputs, exports, and deletion paths.

## Core knowledge
Leakage can arise from authorization defects, context mixing, verbose errors, logs, prompt disclosure, memorization, retrieval mistakes, caching, or unsafe output rendering. Synthetic canaries enable testing without real secrets.

## Procedure
1. Define data classes and forbidden disclosure boundaries.
2. Insert unique synthetic canaries into isolated contexts.
3. Attempt direct extraction and indirect elicitation.
4. Test cross-session, cross-user, and cross-tenant boundaries.
5. Test logs, traces, errors, caches, and exports.
6. Test transformed disclosure through summaries or encoded output.
7. Validate deletion and retention behavior.
8. Map findings to root causes and controls.
9. Add canary-based regression checks where stable.

## Decision points
Fix authorization and data minimization before relying on output filters. Redact telemetry when observability value does not justify sensitive payload capture.

## Common failure patterns
Using real customer secrets in tests; treating system prompts as secrets; checking only exact-string leakage; ignoring derived sensitive information; shared caches without tenant keys.

## Verification
Show that synthetic protected data remains inaccessible across unauthorized contexts while legitimate authorized workflows continue to function.

## Expected output
A leakage assessment with data class, attack path, evidence, severity, remediation, and regression coverage.

## Stop conditions
Stop if testing would access real data outside authorization, require production secret extraction, or violate retention/privacy constraints.