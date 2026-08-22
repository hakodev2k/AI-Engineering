# Merge Conflict Hooks

## pre-resolution-inventory
**Trigger:** before editing a conflicted file.  
**Action:** run `python scripts/scan-conflicts.py --output .ai/conflicts.json` then `python scripts/capture-side-signatures.py --inventory .ai/conflicts.json --output .ai/conflicts.signed.json`.  
**Expected:** inventory contains the current conflict set and signatures.  
**Failure:** block resolution.  
**Blocking:** yes.

## post-resolution-marker-check
**Trigger:** after each conflict-resolution edit.  
**Action:** search changed files for `<<<<<<<`, `=======`, and `>>>>>>>`; the deterministic evaluator repeats this check.  
**Expected:** zero markers in resolved files.  
**Failure:** block.  
**Blocking:** yes.

## pre-targeted-verification
**Trigger:** after all conflict decisions have been applied.  
**Precondition:** every conflict ID has rationale and targeted checks.  
**Action:** execute the declared targeted checks and preserve their output for the exact worktree state.  
**Failure:** one remediation cycle maximum, then stop.  
**Blocking:** yes.

## pre-resolution-evaluation
**Trigger:** before review.  
**Action:** `python scripts/evaluate-resolution.py --inventory .ai/conflicts.signed.json --resolution .ai/resolution.json --policy config/conflict-policy.json --root . --output .ai/resolution-report.json`.  
**Expected:** `pass` or `review-required`.  
**Failure:** `blocked` stops the workflow.  
**Blocking:** yes.

## pre-final-verification
**Trigger:** immediately before declaring the conflict resolution verified.  
**Action:** `python scripts/verify-final-gate.py --report .ai/resolution-report.json --inventory .ai/conflicts.signed.json --policy config/conflict-policy.json --review .ai/conflict-review.json --actor <implementation-actor>`. Omit `--review` only when policy/risk does not require review.  
**Expected:** `verified`.  
**Failure:** block.  
**Blocking:** yes.

## post-final-gate
**Trigger:** after final gate verification.  
**Action:** run the repository's broader build/test/static-analysis suite appropriate to the affected scope; inspect the final diff for unrelated changes.  
**Failure:** preserve evidence and stop; final gate alone does not prove application correctness.  
**Blocking:** yes.

## approval-boundary
**Trigger:** before any approval-required action listed in `config/conflict-policy.json`.  
**Action:** stop and obtain explicit human approval bound to the exact action/scope.  
**Failure:** do not execute the action.  
**Blocking:** yes.
