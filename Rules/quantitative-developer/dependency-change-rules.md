# Dependency Change Rules

## Purpose
Control correctness, security, and reproducibility risk introduced by quantitative software dependencies.

## Scope
Applies to numerical, statistical, optimization, data, runtime, compiler, and system libraries.

## MUST
- Production dependencies MUST have controlled versions and a documented upgrade path.
- Material upgrades MUST be tested against representative quantitative outputs, numerical tolerances, performance, and serialization compatibility.
- Changes in defaults, random generators, solvers, calendars, parsers, and floating-point behavior MUST be explicitly assessed.
- Critical dependency provenance and licensing MUST be known before production adoption.
- Security-critical upgrades MUST balance vulnerability exposure against regression risk using documented evidence.

## MUST NOT
- Major dependency migrations MUST NOT be executed in production without human approval and rollback planning.
- A green build MUST NOT be considered sufficient evidence that numerical behavior is unchanged.
- Deprecated or unmaintained critical libraries MUST NOT remain indefinitely without recorded risk acceptance.

## SHOULD
- Keep dependency surfaces minimal and isolate vendor-specific behavior behind tested interfaces.
- Use automated vulnerability and license scanning.

## Exceptions
Exceptions require rationale, impact assessment, compensating controls, expiry, and owner approval.

## Verification
Review lockfiles, dependency diffs, release notes, security scans, golden-result regression tests, serialization tests, benchmarks, and rollback evidence.