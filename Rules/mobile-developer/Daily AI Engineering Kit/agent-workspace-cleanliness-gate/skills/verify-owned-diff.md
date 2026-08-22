# Verify Owned Diff

## Purpose
Prove that the final workspace contains only task-owned changes or explicitly reviewed exceptions.

## Inputs
Baseline snapshot, current snapshot, owned-diff manifest, optional independent review, optional human approval.

## Procedure
1. Capture current state: `python scripts/capture-workspace.py --repo . --output workspace-current.json`.
2. Derive classifications with `python scripts/derive-owned-diff.py --baseline workspace-baseline.json --current workspace-current.json --manifest owned-diff-manifest.json --output owned-diff.json`.
3. Inspect `unowned_paths`; any entry is a blocker until removed from the agent change or the task scope is legitimately replanned before further mutation.
4. Inspect `preexisting_touched_paths`; determine whether the agent actually changed, resolved, deleted, or otherwise altered pre-existing work.
5. For any touched pre-existing path, obtain independent review bound to baseline/current/owned-diff fingerprints.
6. Run `python scripts/evaluate-workspace-gate.py --diff owned-diff.json --manifest owned-diff-manifest.json --policy config/workspace-policy.json --review workspace-review.json --output workspace-gate.json` when review is needed; omit `--review` otherwise.
7. Run tests/build/formatting only after scope ownership is understood. If those tools generate new files, recapture and repeat steps 2–6.
8. Immediately before completion, capture again and run `evaluate-final-gate.py` so post-review drift cannot pass unnoticed.

## Verification
Success requires zero unowned changes, no unreviewed pre-existing touch, no HEAD drift, no post-gate workspace drift, and required human approvals bound to the exact owned-diff fingerprint.

## Failure handling
Do not use `git reset --hard`, `git clean`, checkout, stash, or file deletion to make the gate green unless the human explicitly approved discarding identified pre-existing work. Preserve baseline and failing gate evidence.

## Stop conditions
Stop on unknown ownership, scope ambiguity, stale review, HEAD drift, or any required dangerous action without approval.
