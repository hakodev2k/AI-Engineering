# Workflow: Reconcile and Verify

## Trigger
Missing assistant prose, suspected transcript corruption, or any change to streaming/persistence/hydration code.

## Goal
Locate and eliminate silent loss without relying on subjective UI observation.

## Inputs
Emission ledger, transcript ledger, reproducible session fixture.

## Baseline
Record emitted count, persisted count, missing/mismatch count, and integrity rate before changes.

## Context
Treat emission, persistence, export/resume, and UI as separate boundaries.

## Stages
1. **Observe** — reproduce and capture stable IDs.
2. **Measure baseline** — run the guard on at least one failing and one normal turn.
3. **Diagnose** — identify the first boundary where the ID disappears or changes.
4. **Form hypothesis** — state one observable mechanism such as an unflushed buffer or dropped event shape.
5. **Implement improvement** — change only that boundary where feasible.
6. **Measure again** — rerun identical fixtures.
7. **Verify** — independent Transcript Verifier checks persistence and resume/export.

## Responsible agent
Investigator for stages 1–5; Transcript Verifier for stage 7.

## Tools
Reference guard, runtime logs, deterministic tests.

## Outputs
Before/after metrics, failure boundary, patch evidence, verification result.

## Checkpoints
After baseline; after boundary localization; after first post-change run; before completion.

## Metrics
Integrity rate MUST reach 100% for required fixture events; zero hash mismatches; no increase in transcript API validation failures.

## Retry policy
Maximum two implementation hypotheses. Each retry must use new evidence.

## Stop conditions
Stop and escalate if two hypotheses fail, event identity cannot be established, or required capture is unavailable.

## Failure path
Preserve ledgers, mark result unverified, disable/avoid the affected completion path where operationally feasible; do not weaken the invariant.

## Definition of Done
Implemented, measured, and independently verified states are all recorded; failing fixtures become passing without breaking normal fixtures.