# Build Testing Rules

## Purpose
Validate build-system behavior as production engineering code rather than treating build logic as untested glue.

## Scope
Applies to build rules, macros, generators, dependency analysis, cache logic, packaging, and platform-specific branches.

## MUST
- Build-system changes that alter dependency resolution, invalidation, packaging, or platform behavior MUST include automated regression coverage where practical.
- Tests MUST cover both successful execution and representative failure modes.
- Critical build rules MUST be exercised in clean environments independent of developer workstation state.
- Changes affecting incremental behavior MUST compare incremental results against clean-build expectations.
- Build tests MUST fail deterministically and provide actionable diagnostics.

## MUST NOT
- MUST NOT rely only on manual local builds as proof of build-system correctness.
- MUST NOT mask flaky build tests with unbounded retries.
- MUST NOT skip platform-specific validation for supported release targets without documented risk acceptance.

## SHOULD
- Small build-rule units SHOULD have focused tests, while end-to-end build paths SHOULD validate integration behavior.
- Test fixtures SHOULD minimize unrelated repository work to keep feedback fast.

## Exceptions
Exceptions require documented inability to automate, manual evidence requirements, risk assessment, and a plan to add automation when feasible.

## Verification
Review CI test coverage, run targeted regression tests, compare clean and incremental outputs, and inspect failure-path assertions.