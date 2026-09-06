# Skill: Pre-Change Investigation

## Purpose
Determine whether a repository change is actually required before any source mutation occurs.

## Trigger
Run for bug-fix, maintenance, remediation, refactor, or issue-resolution tasks before write-capable tools are enabled.

## Inputs
- User or issue request.
- Current repository checkout and branch.
- Relevant issue/PR metadata when available.
- Existing tests, logs, reproduction steps, and git history.

## Preconditions
The agent MUST have read access to the relevant repository state. The investigation phase MUST NOT require source writes.

## Required context
Only context needed to establish current behavior, expected behavior, prior fixes, and constraints. Unrelated repository content SHOULD NOT be loaded.

## Allowed tools
Read-only filesystem/repository inspection, search, git log/blame/diff, test execution, build/run commands that do not mutate tracked source, issue/PR lookup, and diagnostic tools.

## Constraints
- MUST treat `no-change` as a valid successful outcome.
- MUST separate observed facts from assumptions.
- MUST NOT infer that a patch is necessary merely because a ticket exists.
- MUST NOT convert a failed reproduction directly into `no-change` without checking partial-fix and environment hypotheses.
- MUST record evidence identifiers or commands sufficient for another reviewer to reproduce the decision.

## Procedure
1. Parse the requested behavior into explicit acceptance conditions.
2. Capture repository identity: branch, HEAD, relevant package/component versions, and working-tree status.
3. Search git history, linked PRs/issues, changelog, and relevant tests for evidence that the issue was already addressed.
4. Reproduce the reported behavior using the closest feasible environment.
5. Compare actual behavior with acceptance conditions.
6. Check for partial resolution: some paths, inputs, platforms, or edge cases may still fail.
7. Form competing hypotheses: unresolved defect, fully resolved/stale report, partial fix, environment mismatch, insufficient evidence.
8. Collect discriminating evidence for each live hypothesis.
9. Produce a structured decision record with `facts`, `assumptions`, `evidence`, `hypotheses`, `decision`, `risks`, and `verification_status`.
10. Pass the record to `scripts/decision_gate.py` and then to the independent reviewer when ambiguity or risk remains.

## Decision points
- `change-required`: current behavior violates acceptance conditions and evidence identifies a repository-controlled correction path.
- `no-change`: acceptance conditions are already satisfied in the current target state, with supporting reproduction/history evidence.
- `insufficient-evidence`: the state cannot be established safely; writes remain blocked.

## Expected output
A JSON decision record compatible with `scripts/decision_gate.py`.

## Metrics
- Percentage of write tasks with a valid pre-change record.
- False-change rate on known already-fixed tasks.
- False-abstention rate on partially fixed tasks.
- Median investigation time before first write.
- Reviewer disagreement rate.

## Verification
A second agent or human SHOULD be able to reproduce the decisive observations without relying on hidden reasoning.

## Failure handling
If reproduction is unavailable, record the missing prerequisite and use alternate evidence such as tests, history, release state, or a minimal read-only diagnostic. If decisive evidence still cannot be obtained, return `insufficient-evidence`.

## Stop conditions
Stop investigation when one decision is supported by all required evidence classes, or when the configured investigation budget is exhausted. Do not continue open-ended exploration.
