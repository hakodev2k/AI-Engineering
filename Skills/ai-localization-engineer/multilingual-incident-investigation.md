# Multilingual Incident Investigation

## Purpose
Investigate production incidents whose symptoms or root causes depend on language, locale, script, translation, retrieval, or market configuration.

## When to use
Use when failures occur only for certain locales, language-specific quality drops appear, or multilingual behavior differs after a release.

## Inputs
Incident description, logs, traces, affected locales, model and prompt versions, translation/retrieval configuration, release timeline, and user examples.

## Preconditions
Relevant production evidence is available under appropriate privacy controls.

## Context to inspect
Inspect locale resolution, fallback behavior, prompt variants, model routing, translation services, retrieval indexes, caches, moderation, feature flags, and recent deployments.

## Core knowledge
Multilingual incidents often arise from mismatched versioning, locale metadata loss, fallback contamination, unsupported model behavior, stale translation assets, or locale-specific data skew. Reproduction requires preserving the exact language and configuration.

## Procedure
1. Define affected locales and observable impact.
2. Reconstruct the request path and system versions.
3. Compare failing and unaffected locales under equivalent conditions.
4. Check locale propagation and fallback decisions.
5. Inspect prompt, model, retrieval, translation, and moderation differences.
6. Reproduce with sanitized representative inputs.
7. Isolate the smallest causal change.
8. Mitigate safely, then add regression coverage.
9. Document root cause and prevention actions.

## Decision points
Rollback when blast radius or severity is high and a safe previous configuration exists; use targeted locale disablement when the defect is isolated and other markets remain healthy.

## Common failure patterns
Translating the failing input to English for debugging, losing exact Unicode content, blaming the model before checking routing/configuration, and fixing symptoms without regression cases.

## Verification
Reproduce the pre-fix failure, verify the mitigation on the original locale path, and confirm unaffected locales remain stable.

## Expected output
A root-cause record with evidence, mitigation, regression tests, and prevention actions.

## Stop conditions
Stop when production access is insufficient, evidence contains restricted data requiring approval, or a high-severity incident needs centralized incident command.