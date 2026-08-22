# Skill: Triage a Suspected Flaky Test

## Purpose
Determine whether a failing test is deterministic, flaky, or blocked by tooling without allowing an agent to rerun until green.

## When to use
Use after a test fails unexpectedly, especially when a prior run passed, CI and local results disagree, or an agent is about to retry a failure.

## Inputs
- Exact failing test identifier or narrow test selector.
- Original test command and first failing output.
- Repository revision and relevant environment facts.

## Preconditions
The first failure evidence is preserved. The probe command is permitted by `config/flake-gate.json`. No production system is required.

## Required context
Read the failing test, nearby fixtures/setup/teardown, code under test, and recent changes that can affect shared state, time, randomness, filesystem, network, concurrency, or ordering.

## Allowed tools
Repository read/search, local test runner, deterministic scripts in this package, build/test logs, non-production test fixtures.

## Constraints
Follow `rules/test-flakiness-rules.md`. Do not disable tests or weaken assertions. Use at most the configured probe count.

## Procedure
1. Save the original failure as run 0 evidence.
2. Identify the narrowest command that executes the same test without changing semantics.
3. Record revision, runtime, test framework, seed when available, parallelism, timezone, and external dependencies.
4. Run `python scripts/run_flake_probe.py --test-id <id> --command "<command>" --config config/flake-gate.json`.
5. If all bounded runs pass, classify `passed` but retain the original failure as unresolved historical evidence; do not claim the test is healthy solely from the probe.
6. If all probe runs fail in materially the same way, classify `consistent-failure` and hand off to normal defect investigation.
7. If at least one run passes and one fails under materially equivalent inputs, classify `flaky`.
8. For `flaky`, compare failure evidence for timing, ordering, shared mutable state, random data, clock dependence, network dependency, resource exhaustion, or cleanup leakage.
9. Form one hypothesis at a time. Change only one experimental variable per experiment and record it.
10. Stop when the cause is proven, the bounded evidence is exhausted, or further experiments require approval/environment changes.

## Expected output
A result matching `schemas/flake-result.schema.json`, plus preserved run logs and a completed investigation report based on `templates/flake-investigation-report.md`.

## Verification
A `flaky` classification requires both pass and fail evidence. A `consistent-failure` classification requires no passing probe run. Tool failures must not be counted as product failures.

## Failure handling
On runner/tool/environment failure, preserve logs, classify `tool-failure` when all runs are invalid, and retry only after the environment problem is corrected. Maximum probe runs remain unchanged.

## Stop conditions
Stop after configured maximum runs; on any required production access; before quarantine changes; or when evidence shows a deterministic failure that belongs in normal debugging.
