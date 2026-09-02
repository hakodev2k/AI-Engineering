# Taint Analysis

## Purpose
Track untrusted or sensitive data from sources through program transformations to security-relevant sinks.

## When to use
Use for injection, SSRF, path traversal, secret leakage, privacy-flow, unsafe deserialization, and data-exfiltration analysis.

## Inputs
Source/sink definitions, sanitizers, IR, call graph, alias information, framework models, and threat assumptions.

## Preconditions
Define what data classes matter and what constitutes an effective sanitizer for each sink type.

## Context to inspect
Input APIs, encoding/decoding, validation, storage, framework routing, templating, database calls, network clients, subprocess APIs, and logging.

## Core knowledge
Taint analysis may be explicit-flow only or include implicit flows. Field, path, and context sensitivity strongly affect precision. Sanitization is sink-specific; generic validation rarely removes every risk.

## Procedure
1. Define taint kinds and trust boundaries.
2. Enumerate sources, sinks, propagators, and sanitizers.
3. Model library/framework behavior.
4. Propagate taint intra- and interprocedurally.
5. Incorporate aliases and heap fields where required.
6. Preserve path provenance for findings.
7. Apply sanitizer semantics narrowly.
8. Rank results by exploitability and confidence.
9. Add regression tests for true and false cases.
10. Measure analysis cost and finding quality.

## Decision points
Include implicit flows only when threat requirements justify the complexity. Prefer targeted framework models over broad conservative tainting when false positives become operationally harmful.

## Common failure patterns
Over-broad sources, universal sanitizer assumptions, missing string/collection propagation, unsound unknown-call behavior, and reporting sink proximity without a feasible path.

## Verification
Use vulnerable and safe fixtures, manually inspect representative paths, and compare findings with dynamic tests where practical.

## Expected output
Traceable taint findings with source-to-sink paths, sanitizer reasoning, severity, and confidence.

## Stop conditions
Stop when source/sink semantics are undefined or framework behavior cannot be modeled well enough to support the intended security claim.