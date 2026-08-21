# Dependency License Hooks

## Hook: pre-dependency-change
**Trigger:** before an agent edits dependency manifests, lockfiles, package sources, vendored code, or dependency-management configuration.

**Preconditions:** base dependency state is readable.

**Action:** capture base dependency identity and current policy version; identify whether the requested change is approval-sensitive (large upgrade, vendoring, source change, redistribution impact).

**Expected result:** base reference and policy version are recorded before editing.

**Failure behavior:** block dependency mutation if base state cannot be established.

**Blocking:** yes.

---

## Hook: post-dependency-change
**Trigger:** dependency-related files changed.

**Preconditions:** candidate dependency state is readable.

**Action:** run evidence capture/validation and deterministic policy evaluation.

```bash
python scripts/validate-license-inventory.py --inventory <inventory.json> --policy config/license-policy.json
python scripts/evaluate-license-policy.py --inventory <inventory.json> --policy config/license-policy.json --output <evaluation.json>
```

**Expected result:** candidate dependency set has a validated inventory and policy evaluation.

**Failure behavior:** preserve artifacts; block merge/release recommendation.

**Blocking:** yes.

---

## Hook: pre-merge-or-release
**Trigger:** agent is about to claim dependency/license checks are complete, prepare a merge, or recommend release.

**Preconditions:** inventory and evaluation exist; review/exception exists where required.

**Action:** run final gate.

```bash
python scripts/evaluate-license-gate.py --inventory <inventory.json> --evaluation <evaluation.json> --policy config/license-policy.json [--review <review.json>] [--exception <exception.json>]
```

**Expected result:** `verified`.

**Failure behavior:** stop and report the gate status/reasons; do not merge/release or claim verification.

**Blocking:** yes.

---

## Hook: policy-or-dependency-drift
**Trigger:** dependency files, package source, distribution mode, inventory, or policy changes after evaluation/review.

**Action:** invalidate prior review/exception usage for the changed fingerprint and rerun evaluation. An exception may only remain valid when its exact package/version/source/license/policy bindings still match.

**Expected result:** fresh gate evidence bound to the current candidate state.

**Failure behavior:** block completion.

**Blocking:** yes.