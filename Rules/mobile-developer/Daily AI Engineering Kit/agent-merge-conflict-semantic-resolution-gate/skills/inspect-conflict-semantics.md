# Inspect Conflict Semantics

## Purpose
Understand what each side of a Git conflict is trying to preserve before editing the conflicted file.

## When to use
Use whenever a merge, rebase, cherry-pick, revert, or branch integration creates textual conflicts whose correct resolution depends on behavior rather than syntax.

## Inputs
- Conflicted repository/worktree.
- Conflict inventory from `scripts/scan-conflicts.py`.
- Nearby implementation, tests, contracts, migrations, configuration, and issue/PR context when available.

## Preconditions
- Do not begin from an unrelated dirty worktree.
- Record the current revision and integration operation.
- Dangerous follow-up actions remain subject to human approval.

## Allowed tools
Read repository files, Git history/diff, tests, build tooling, static analysis, and read-only external documentation where required.

## Constraints
- Do not resolve by automatically choosing `ours` or `theirs` for all conflicts.
- Treat each side as evidence, not as inherently correct.
- Separate facts, hypotheses, decisions, evidence, and open questions.

## Procedure
1. Run `scripts/scan-conflicts.py` and `scripts/capture-side-signatures.py`.
2. For each conflict, identify the affected symbol, behavior, public contract, data shape, configuration, or deployment concern.
3. Trace relevant callers/callees and locate tests covering both sides' intent.
4. Inspect the commits/PRs that introduced each side when available.
5. Record what `ours` preserves and what `theirs` preserves.
6. Classify risk. Escalate conflicts touching authentication, authorization, migrations, infrastructure, API/contracts, production configuration, destructive behavior, or security controls.
7. Define the intended merged behavior independently of the conflict markers.
8. Define targeted checks that can prove the merged behavior.
9. Hand off a resolution decision containing rationale, preserved-side declaration, targeted checks, and any approval-required action.

## Expected output
A populated resolution decision matching `schemas/resolution-decision.schema.json`.

## Verification
Every conflict ID in the inventory has exactly one resolution decision and at least one targeted check.

## Failure handling
If intent cannot be determined from evidence, stop that conflict as unresolved and request owner/domain clarification. Do not invent business rules.

## Stop conditions
Stop before destructive SQL, schema changes, force push/history rewrite, infrastructure/secret/production configuration changes, security weakening, breaking public contracts, irreversible migrations, or large dependency upgrades without explicit human approval.
