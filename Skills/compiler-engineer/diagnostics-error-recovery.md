# Diagnostics and Error Recovery

## Purpose
Produce precise, stable, actionable compiler diagnostics while continuing analysis safely after user errors.

## When to use
Use when adding language rules, improving messages, reducing cascades, or supporting IDE/incremental scenarios.

## Inputs
Invalid programs, language rules, source locations, diagnostic conventions, recovery structures.

## Context to inspect
Diagnostic engine, severity/codes, source mapping, parser recovery, error symbols/types, suppression and deduplication.

## Core knowledge
A diagnostic is part of developer UX and often tooling API. Primary errors should be localized; recovery should preserve enough structure to find independent errors without inventing valid semantics.

## Procedure
1. Identify the earliest reliable point to diagnose.
2. Attach precise source ranges and stable diagnostic identity.
3. Explain violated rule and, when safe, a correction.
4. Introduce recovery nodes/symbols that prevent cascades.
5. Suppress derivative diagnostics only when causally dependent.
6. Test malformed prefixes, nested errors, and multiple independent errors.
7. Check localization/tooling stability requirements.

## Decision points
Diagnose in the earliest stage that has sufficient semantic context. Prefer one high-confidence primary message over multiple speculative ones.

## Common failure patterns
Cascading errors, diagnostics dependent on hash/order, pointing at generated code, unsafe fix suggestions, recovery changing later valid semantics.

## Verification
Golden diagnostic tests, IDE/incremental tests, malformed-input fuzzing, and stability checks across runs.

## Expected output
Actionable diagnostics with resilient recovery and regression coverage.

## Stop conditions
Escalate when the specification does not define whether a construct is valid or when a suggested fix could change intent unpredictably.