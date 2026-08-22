# Skill: Generate High-Signal Tests

## Purpose
Generate or improve automated tests that prove changed behavior rather than merely increasing coverage.

## When to use
Use after a feature, bug fix, refactor, dependency change, or AI-generated code change requires new regression coverage.

## Inputs
- Changed files or diff.
- Acceptance criteria or bug evidence.
- Existing test conventions and test command.
- `config/test-quality.yaml`.

## Preconditions
- Repository is available and builds far enough to discover its test projects.
- The target behavior can be described as observable outcomes.
- Approval-required production or contract changes are not being performed by this skill.

## Required context
Read the changed implementation, adjacent tests, fixtures/builders, public contract touched by the change, and relevant error handling. Expand context only when evidence requires it.

## Allowed tools
Repository read/search, code editing, local build/test commands, static analysis, coverage tools already present in the repository.

## Constraints
Follow `rules/test-quality-rules.md`. Do not weaken production code to make a test pass. Do not add new test dependencies unless existing tooling cannot express the required behavior and approval is obtained for a material dependency change.

## Procedure
1. Enumerate each changed behavior and classify it as happy path, boundary, negative/failure path, state transition, concurrency-sensitive, or contract behavior.
2. Locate existing tests closest to each behavior and reuse repository conventions.
3. For every proposed test, write a one-line failure proposition: what exact incorrect behavior would make this test fail?
4. Reject tests whose only proposition is construction succeeds, value is non-null, or implementation details were invoked.
5. Select the smallest set of tests covering the changed behavior and at least one negative/boundary case when relevant.
6. Control unstable dependencies: time, randomness, network, external processes, filesystem, environment variables, and ordering.
7. Implement tests with behavior-oriented names and meaningful assertions.
8. Run the narrowest relevant test target.
9. If failures are caused by test defects, repair and rerun at most two times. Preserve command output summaries for each attempt.
10. Run `python scripts/check-generated-tests.py --base <base-ref>` from the package root copied into the repository, or the equivalent path after installation.
11. Run the repository's broader relevant test suite when practical.
12. Inspect the diff for unrelated generated files, snapshots, changed fixtures, skipped tests, or production-code weakening.
13. Produce evidence conforming to `schemas/test-evidence.schema.json`.

## Expected output
A minimal test diff plus structured evidence listing changed behavior, each test's assertion intent, executed commands, exit codes, remaining risks, and approval state.

## Verification
A successful outcome requires relevant tests passing, static guard exit code 0, no skipped/focused generated tests, and an explicit mapping from changed behavior to assertions.

## Failure handling
- Transient tool failure: retry the command once.
- Test failure caused by implementation: stop test-only work and hand back to implementation owner with evidence.
- Test defect: fix and retry, maximum two repair attempts.
- Environment/permission failure: preserve output and mark blocked.
- Approval boundary reached: mark `needs-approval` and stop before the action.

## Stop conditions
Stop when verification passes, retry budget is exhausted, an implementation defect is proven, required context is unavailable, or explicit approval is required.
