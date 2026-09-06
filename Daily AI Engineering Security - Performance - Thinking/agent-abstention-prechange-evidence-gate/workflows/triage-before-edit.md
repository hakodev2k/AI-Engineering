# Workflow: Triage Before Edit

## Trigger
Any request that could mutate an existing repository to address a bug, maintenance ticket, regression, or remediation item.

## Goal
Prevent unnecessary or misdirected source changes while preserving the ability to repair partially fixed or environment-specific defects.

## Inputs
Issue/request, repository state, test commands, history, relevant runtime/environment facts.

## Baseline
Record the current HEAD, working-tree status, current acceptance-condition results, and whether the reported behavior reproduces.

## Context
Use `skills/prechange-investigation.md` and enforce `rules/action-calibration.md`.

## Stages
1. **Observe** — extract acceptance conditions and inspect current state.
2. **Measure baseline** — run safe reproduction/tests and capture results.
3. **Diagnose** — inspect history and distinguish unresolved, resolved, partial-fix, environment mismatch, and unknown states.
4. **Form hypothesis** — record competing explanations and discriminating evidence.
5. **Gate** — validate the structured record with `scripts/decision_gate.py`.
6. **Independent review** — invoke `subagents/change-necessity-reviewer.md` for risky or ambiguous work.
7. **Implement improvement** — only when `change-required` passes the gate.
8. **Measure again** — rerun the baseline and relevant regression suite.
9. **Verify** — prove acceptance conditions and ensure no unnecessary behavior change.

## Responsible agent
Primary investigation/implementation agent; independent change-necessity reviewer at checkpoint 6.

## Tools
Repository read/search, git history, safe tests/builds, decision gate, implementation tools only after approval.

## Outputs
Decision record, baseline evidence, patch or explicit no-change result, before/after verification record.

## Checkpoints
- CP1: acceptance conditions are explicit.
- CP2: current behavior is observed or inability to observe is documented.
- CP3: partial-fix and stale-report hypotheses considered.
- CP4: decision gate passes.
- CP5: post-change/no-change verification complete.

## Metrics
False-change rate, false-abstention rate, write-gate coverage, review disagreement, regression count, time to justified decision.

## Retry policy
Maximum three diagnosis/hypothesis rounds. After implementation, maximum two fix-and-retest iterations.

## Stop conditions
Stop with `no-change` when current behavior satisfies acceptance conditions and evidence is sufficient. Stop with `insufficient-evidence` after the diagnosis budget is exhausted. Stop implementation after two unsuccessful repair iterations and escalate.

## Failure path
Preserve evidence, revert unverified local changes when safe, report the blocking evidence gap, and require human direction before any dangerous or irreversible action.

## Verification
A successful change must pass the original reproduction/acceptance check and relevant regression tests. A successful abstention must have independently reviewable current-state evidence.

## Definition of Done
Evidence documented; baseline captured; decision gate passed; required independent review completed; implementation status explicitly stated; after-state measured; verification complete; no blocking contradiction remains.
