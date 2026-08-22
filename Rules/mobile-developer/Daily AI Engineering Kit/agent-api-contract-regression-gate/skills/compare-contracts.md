# Skill: Compare API Contracts

## Purpose
Determine whether a candidate OpenAPI document introduces backward-incompatible changes relative to an accepted baseline.

## When to use
Use after the baseline and candidate contracts have both been captured and normalized.

## Inputs
- Baseline OpenAPI document.
- Candidate OpenAPI document.
- `config/gate.yaml` policy.
- Output report path.

## Preconditions
- Both documents parse successfully.
- Both contain a `paths` object.
- Baseline identity is known and accepted.

## Required context
Relevant implementation diff, nearby API tests, release intent, and consumer expectations when available.

## Allowed tools
Repository read tools, test/build commands, `scripts/compare-openapi.py`, and non-destructive inspection tools.

## Constraints
- Deterministic findings take precedence over an agent's intuition.
- A confirmed breaking change requires human approval before merge/deploy/release.
- Do not modify either input contract during comparison.

## Procedure
1. Run `python3 scripts/compare-openapi.py --baseline <baseline> --candidate <candidate> --output <report>`.
2. Interpret exit code `0` as no detected breaking changes, `2` as breaking changes detected, and `1` as operational/validation failure.
3. Review each breaking finding and map it to implementation changes.
4. Distinguish intentional changes from accidental regressions; intentional does not mean approved.
5. Inspect API tests and acceptance criteria for semantic behavior not represented in OpenAPI.
6. If no breaking changes are detected, run relevant tests and inspect the code diff for hidden behavioral changes.
7. If breaking changes are detected, set workflow state to `needs-approval` and stop before protected actions.
8. Preserve the generated report as evidence.

## Expected output
A JSON report conforming to `schemas/contract-report.schema.json` with breaking and non-breaking findings.

## Verification
- Comparison completed against the exact baseline/candidate paths requested.
- Report is parseable JSON.
- Every finding includes code, location, message, and evidence.
- Relevant implementation tests pass before final success.

## Failure handling
- Parse/validation error: no retry unless the input artifact is regenerated; maximum 1 comparison retry.
- Tool failure: preserve stderr and input paths, then stop after the configured retry.
- Test failure: classify separately from contract comparison and return to implementation; do not alter the baseline.

## Stop conditions
Stop with `pass`, `needs-approval`, or `error`. Never loop indefinitely.
