# Generated Boundary Hooks

## Pre-edit boundary hook
- **Trigger:** before the first repository write.
- **Preconditions:** planned paths available.
- **Action:** validate the generated-boundary manifest.
- **Command:** `python scripts/validate-generated-boundary.py --manifest <manifest.json> --policy config/generated-boundary-policy.json`
- **Expected result:** exit 0 with no unresolved protected targets.
- **Failure behavior:** block editing.
- **Blocking:** yes.

## Post-regeneration diff hook
- **Trigger:** after a generator command changes the worktree.
- **Preconditions:** validated manifest and Git repository.
- **Action:** compare changed paths against classifications/source relationships.
- **Command:** `python scripts/inspect-generated-diff.py --manifest <manifest.json> --output <diff-report.json>`
- **Expected result:** all protected changes are explained.
- **Failure behavior:** preserve report and block completion.
- **Blocking:** yes.

## Final verification hook
- **Trigger:** before marking task complete, merge-ready, or verified.
- **Preconditions:** manifest, diff report, reviewer record, and verification evidence exist.
- **Action:** evaluate final policy gate.
- **Command:** `python scripts/evaluate-generated-boundary-gate.py --manifest <manifest.json> --diff-report <diff-report.json> --review <review.json> --verification <verification.json> --policy config/generated-boundary-policy.json`
- **Expected result:** status `verified`, exit 0.
- **Failure behavior:** `blocked` or `human-approval-required`; do not claim completion.
- **Blocking:** yes.
