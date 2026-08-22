# Skill: Diff Scope Verification

## Purpose
Independently verify that an agent-generated diff is fully explained, stays within approved scope, and has sufficient evidence and verification coverage.

## When to use
Use after implementation and before merge, release preparation, or any approval-required action.

## Inputs
- Provenance record.
- Diff manifest.
- Baseline and current repository state.
- Policy from `config/provenance-policy.json`.
- Test/build/static-analysis results.

## Preconditions
- Provenance record passes structural validation.
- Reviewer is not the sole author of the implementation.

## Procedure
1. Recompute the diff manifest from the declared baseline.
2. Compare recomputed paths and change counts with the submitted record.
3. Inspect each changed file and verify that the stated rationale actually explains the material diff.
4. Verify evidence references exist and are relevant to the claimed change.
5. Check allowed scope against every changed path.
6. Identify hidden changes: formatting sweeps, dependency changes, generated files, config edits, deleted files, public-contract changes, or security-sensitive changes.
7. Verify each material change has at least one concrete verification check and a recorded result.
8. Mark findings as `pass`, `needs-revision`, `human-approval-required`, or `block`.
9. Run `scripts/evaluate-provenance-gate.py` for the deterministic gate.

## Verification
A review is complete only when the recomputed diff matches the recorded change inventory and no blocking finding remains.

## Failure handling
- Diff drift since provenance capture: invalidate review and regenerate evidence.
- Missing/changed evidence: block and request refresh.
- Dangerous change detected: require explicit human approval before proceeding.

## Stop conditions
Do not approve when the author and reviewer are the same identity for a high-risk task, or when any unexplained/out-of-scope/unverified change remains.