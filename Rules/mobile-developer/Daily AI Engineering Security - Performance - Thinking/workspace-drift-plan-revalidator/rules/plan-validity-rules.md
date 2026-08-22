# Plan Validity Rules

## MUST
- Capture a repository checkpoint before pausing or handing off a plan that will be resumed later.
- Compare current repository state with that checkpoint before resuming implementation.
- Treat branch/HEAD, staged changes, unstaged changes, deletions, and untracked files as observable state.
- Link material drift to explicit plan assumptions or prior verification conclusions.
- Refresh evidence for assumptions marked `needs-refresh` or `invalid`.
- Record whether the plan is matched, revised, or rejected.
- Bound drift investigation to two classification passes; escalate unresolved ambiguity after that.

## MUST NOT
- Assume conversation continuity implies workspace continuity.
- Continue high-impact implementation after a failed or unknown drift check.
- Treat all drift as harmless without evidence.
- Force a full repository rescan when changed paths can bound scope.
- Overwrite the baseline before determining what changed.
- Expose file contents in checkpoint metadata.
- Request or expose hidden chain-of-thought.

## SHOULD
- Track plan-critical paths and dependency manifests explicitly.
- Use deterministic comparison before model-based interpretation.
- Re-run only verification affected by drift.
- Store checkpoints outside build artifacts.
- Measure rework avoided and revalidation cost.