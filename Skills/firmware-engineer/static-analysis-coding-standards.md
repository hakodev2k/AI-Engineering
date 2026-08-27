# Static Analysis and Coding Standards

## Purpose
Use automated analysis and focused coding rules to prevent classes of firmware defects before target testing.

## When to use
Use when establishing quality gates, reviewing legacy code, changing compilers or preparing high-reliability releases.

## Inputs
Language standard, compiler, analyzer, project risk profile and coding requirements.

## Context to inspect
Warning levels, suppressions, analyzer configuration, generated code and historical defect classes.

## Core knowledge
Rules are valuable when they target real risks and are consistently enforced. Suppressions are technical decisions requiring rationale and scope.

## Procedure
1. Establish compiler warning baseline.
2. Select analyzers appropriate to language and risk.
3. Prioritize undefined behavior, lifetime, bounds and concurrency findings.
4. Separate generated/vendor code policies where necessary.
5. Fix root causes rather than blanket suppressing.
6. Document justified suppressions locally.
7. Gate new high-severity findings in CI.
8. Periodically review rule effectiveness.

## Decision points
Adopt stricter standards for safety/reliability contexts; avoid rules that create noise without reducing relevant risk.

## Common failure patterns
Thousands of ignored warnings, global suppressions, style rules obscuring correctness issues, analyzer drift and treating clean analysis as proof of correctness.

## Verification
Run analysis from clean builds, inspect suppression inventory and confirm CI rejects newly introduced critical findings.

## Expected output
A maintainable analysis baseline tied to defect prevention.

## Stop conditions
Escalate when compliance standards require interpretations beyond project authority.