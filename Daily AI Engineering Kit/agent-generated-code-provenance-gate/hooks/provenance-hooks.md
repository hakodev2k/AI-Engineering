# Hooks: Agent-Generated Code Provenance Gate

## Pre-task: baseline and scope capture
**Trigger:** before AI editing starts.

**Preconditions:** repository root, baseline ref, task id, and allowed scope are known.

**Action:** store baseline/scope in the provenance record template and ensure the baseline resolves.

**Expected result:** task contract is explicit before edits.

**Failure behavior:** block editing provenance flow if baseline or scope is missing.

**Blocking:** yes.

## Post-edit: rebuild diff manifest
**Trigger:** after any implementation batch or before handoff.

**Action:**

`python scripts/build-diff-manifest.py --repo . --baseline <ref> --output artifacts/diff-manifest.json`

**Expected result:** deterministic current change inventory and diff hash.

**Failure behavior:** preserve error and retry at most once for a transient Git/tool failure.

**Blocking:** yes.

## Pre-review: validate provenance
**Trigger:** before independent review.

**Action:**

`python scripts/validate-provenance.py --record artifacts/provenance-record.json --diff artifacts/diff-manifest.json --policy config/provenance-policy.json`

**Expected result:** exit 0 and no structural/scope/mapping violations.

**Failure behavior:** return to analyst for a maximum of 2 revision cycles.

**Blocking:** yes.

## Post-verification: refresh diff
**Trigger:** after tests/build or any corrective edit.

**Action:** rebuild the diff manifest and compare its hash with the record.

**Expected result:** provenance is not stale after verification fixes.

**Failure behavior:** invalidate the previous review when the diff changed.

**Blocking:** yes.

## Final gate
**Trigger:** before merge/release/handoff completion.

**Action:**

`python scripts/evaluate-provenance-gate.py --record artifacts/provenance-record.json --diff artifacts/diff-manifest.json --policy config/provenance-policy.json`

**Expected result:** `pass`.

**Failure behavior:** `needs-revision` returns to analyst/reviewer; `human-approval-required` stops for explicit approval; `block` stops the workflow.

**Blocking:** yes.