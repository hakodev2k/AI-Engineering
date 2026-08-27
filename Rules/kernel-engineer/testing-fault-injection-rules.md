# Testing and Fault Injection Rules

## Purpose
Require evidence that kernel changes remain correct under normal, concurrent, resource-constrained, and failure conditions.

## Scope
Unit/component tests, integration tests, stress tests, fault injection, fuzzing, and regression coverage.

## MUST
- Bug fixes MUST add regression coverage when the failure can be reproduced deterministically or with a practical harness.
- Changes to cleanup or recovery paths MUST be tested with induced failures at relevant stages.
- Concurrency-sensitive changes MUST include stress or race-oriented validation.
- Boundary parsers MUST receive malformed and edge-case input testing.
- Test failures MUST be investigated rather than repeatedly rerun until passing.

## MUST NOT
- MUST NOT disable a failing diagnostic, sanitizer, or test solely to make CI pass.
- MUST NOT treat one successful boot as sufficient evidence for lifecycle-sensitive changes.
- MUST NOT depend on nondeterministic sleeps when a deterministic synchronization mechanism is practical.

## SHOULD
- Tests SHOULD target invariants and externally meaningful behavior rather than implementation trivia.
- Fault injection SHOULD cover allocation, timeout, partial initialization, and teardown failures where relevant.
- Long-running stress SHOULD complement focused deterministic tests for concurrency changes.

## Exceptions
Exceptions require the untestable condition, alternative evidence, residual risk, and reviewer acceptance.

## Verification
Review CI results, sanitizer/validator runs, fault-injection matrices, stress duration, regression reproducibility, and coverage of changed failure paths.