# Fuzzing and Robustness Rules

## Purpose
Ensure arbitrary inputs cannot easily crash, hang, or corrupt the compiler.

## Scope
Source parsers, IR readers, binary readers, optimizers, code generators, and diagnostic paths.

## MUST
- Externally reachable parsers and complex transformations MUST have fuzz coverage proportional to risk.
- Fuzz findings MUST preserve the triggering input or minimized reproducer.
- Hangs, excessive memory use, assertion failures, and sanitizer findings MUST be treated as defects.
- Fixes MUST be validated against the minimized corpus and adjacent mutations.

## MUST NOT
- MUST NOT discard a crash because the input program is invalid.
- MUST NOT suppress sanitizer findings without proving them unreachable or benign.
- MUST NOT let corpus growth make routine fuzzing operationally unbounded.

## SHOULD
- Fuzzers SHOULD cross phase boundaries and compare optimization levels or compilers where useful.
- Corpora SHOULD retain structurally diverse high-value cases.

## Exceptions
Unsupported input formats may be excluded only when rejection is explicit and safe.

## Verification
Track fuzz coverage, sanitizer runs, minimized regressions, timeout rates, memory ceilings, and corpus health.