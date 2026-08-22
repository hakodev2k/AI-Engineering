# Skill: Change Provenance Capture

## Purpose
Create an auditable mapping from agent-generated code changes to the task requirement, source evidence, rationale, and verification obligation that justify each change.

## When to use
Use before and during any AI-assisted implementation, refactor, bug fix, test generation, migration preparation, or repository maintenance task that changes tracked files.

## Inputs
- Task identifier and acceptance criteria.
- Repository root and baseline Git ref.
- Allowed scope: files/modules/components that may change.
- Source evidence: issue, requirement, design note, failing test, logs, API contract, or repository evidence.
- Current working tree changes.

## Preconditions
- Repository is readable.
- Baseline ref is known and resolvable.
- Task scope is explicit enough to distinguish intended from incidental changes.

## Allowed tools
- Read-only repository search and file inspection.
- Git diff/status commands.
- Build/test tools.
- `scripts/build-diff-manifest.py` and `scripts/validate-provenance.py`.

## Constraints
- Do not invent evidence.
- Do not mark formatting noise as requirement-driven unless formatting was required.
- Do not combine unrelated changes under one vague rationale.
- Do not use the implementation agent as the sole final verifier.

## Procedure
1. Record task id, title, baseline ref, target ref/worktree, and allowed scope.
2. Extract atomic requirements with stable ids such as `REQ-001`.
3. Build a diff manifest from the baseline using `scripts/build-diff-manifest.py`.
4. For every changed file, classify each material change as one of:
   - `requirement`
   - `bug-fix-evidence`
   - `test-support`
   - `refactor-required`
   - `generated`
   - `incidental`
5. Attach at least one requirement/evidence id to every material change entry.
6. Record why the change is necessary and what would fail or remain incorrect without it.
7. Record verification obligations for the change: test ids, build checks, static analysis, contract validation, or manual review.
8. Mark any unexplained or out-of-scope change as blocking; never silently absorb it into another rationale.
9. Run `scripts/validate-provenance.py` against the record.
10. Hand the record and diff manifest to the Provenance Reviewer.

## Expected output
A provenance record matching `schemas/provenance-record.schema.json` plus the generated diff manifest.

## Verification
- Every changed path is represented.
- Every material change has a rationale and at least one evidence/requirement reference.
- Every change has a verification owner/check.
- No out-of-scope path is unacknowledged.

## Failure handling
- Baseline unavailable: stop and request a valid baseline.
- Diff cannot be produced: preserve Git/tool error and stop.
- Missing evidence: mark `unexplained` and block.
- Scope ambiguity: mark `scope-review-required`; do not widen scope automatically.

## Stop conditions
Stop before merge/release when any material change remains unexplained, out of scope, or unverified.