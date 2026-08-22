# Workspace Lifecycle Hooks

## Pre-task baseline
**Trigger:** before the first mutation.  
**Preconditions:** Git repository and task scope are known.  
**Action:** `python scripts/capture-workspace.py --repo . --output workspace-baseline.json`.  
**Expected result:** exit 0 and baseline fingerprint recorded in the manifest.  
**Failure:** retry once only for transient Git/process failure; otherwise stop.  
**Blocking:** yes.

## Post-edit ownership classification
**Trigger:** after edits or any formatter/build/test tool that may write files.  
**Action:** capture `workspace-current.json`, then run `python scripts/derive-owned-diff.py --baseline workspace-baseline.json --current workspace-current.json --manifest owned-diff-manifest.json --output owned-diff.json`.  
**Expected result:** no manifest binding error.  
**Failure:** preserve snapshots and stop.  
**Blocking:** yes.

## Pre-verification workspace gate
**Trigger:** before claiming task tests/build prove the intended change.  
**Action:** `python scripts/evaluate-workspace-gate.py --diff owned-diff.json --manifest owned-diff-manifest.json --policy config/workspace-policy.json --output workspace-gate.json`; include `--review workspace-review.json` when pre-existing changes were touched.  
**Expected result:** `status=verified`.  
**Failure:** `review-required` requests independent review; `blocked` stops.  
**Blocking:** yes.

## Post-verification recapture
**Trigger:** after tests/build/formatting.  
**Action:** capture workspace again. If fingerprint changed, rerun classification and workspace gate before finalization.  
**Failure:** never assume generated files are owned.  
**Blocking:** yes.

## Final completion gate
**Trigger:** immediately before final success/commit preparation.  
**Action:** `python scripts/evaluate-final-gate.py --gate workspace-gate.json --current workspace-final.json --manifest owned-diff-manifest.json --output final-gate.json`; include `--approval workspace-approval.json` when manifest lists approval actions.  
**Expected result:** `status=verified`, exit 0.  
**Failure:** approval-required waits for explicit human approval; drift or mismatch blocks.  
**Blocking:** yes.

## Safety hook
Never automate reset/clean/stash/checkout/deletion of pre-existing changes. Any such cleanup requires explicit human approval tied to the identified paths/actions.
