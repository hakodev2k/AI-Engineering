# Skill: Verify Rollout

## Purpose
Prove that a flag change matches approved scope and remains reversible.

## Inputs
Approved request, Git diff, test/build results, gate output, optional authorized rollout telemetry.

## Process
1. Re-run the static gate against the final request and repository.
2. Inspect changed files and map each change to the requested flag.
3. Confirm disabled-path/fallback behavior still exists unless separately approved for removal.
4. Run relevant unit/integration/E2E tests for enabled and disabled states.
5. Compare final exposure, environment, and targeting to approved values.
6. Check for accidental edits to other flag keys or policy files.
7. If production health is in scope, require timestamped telemetry for agreed success/error/latency signals; do not invent missing evidence.
8. Record status as `verified`, `blocked`, or `implemented-unverified`.

## Verification
`verified` requires all deterministic checks and required evidence to pass. Build success alone is insufficient.

## Failure handling
A test or policy failure blocks verification. Retry only transient tool failures, maximum two attempts. Preserve failing command/output and escalate.

## Stop conditions
Stop on approval drift, missing rollback, unexpected diff, missing required telemetry, or failed checks.