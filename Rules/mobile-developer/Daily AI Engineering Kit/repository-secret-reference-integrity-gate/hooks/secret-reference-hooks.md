# Secret Reference Integrity Hooks

## Hook 1 — Pre-task scope validation
**Trigger:** before an agent edits CI, deployment, config, environment readers, provisioning docs, or secret-reference names.  
**Preconditions:** repository readable; policy present.  
**Action:** capture HEAD, identify affected secret/config surfaces, confirm the task can proceed without secret values.  
**Command:** repository/Git read only.  
**Expected result:** scoped context and current HEAD.  
**Failure behavior:** if secret values or increased permissions are required, stop.  
**Blocking:** yes.

## Hook 2 — Post-edit reference scan
**Trigger:** after any edit that may affect secret names or consumers.  
**Preconditions:** working tree contains intended edits.  
**Action:** regenerate inventory from current repository state.
```bash
python scripts/scan-secret-references.py \
  --repo . \
  --policy config/secret-reference-policy.json \
  --contracts secret-contracts.json \
  --output artifacts/secret-inventory.json
```
**Expected result:** value-free inventory plus fingerprint.  
**Failure behavior:** retry once only for transient file/tool failure; otherwise block.  
**Blocking:** yes.

## Hook 3 — Contract validation
**Trigger:** immediately after scan and before review/merge/release.  
**Action:** validate secret contracts.
```bash
python scripts/validate-secret-inventory.py \
  --inventory artifacts/secret-inventory.json \
  --policy config/secret-reference-policy.json \
  --output artifacts/secret-validation.json
```
**Expected result:** `verified`, `review-required`, or `blocked`.  
**Failure behavior:** do not retry semantic findings. Fix evidence/contracts or escalate.  
**Blocking:** `blocked` is blocking; `review-required` blocks final completion until reviewed.

## Hook 4 — Pre-provider-mutation approval
**Trigger:** before create/delete/rotate/provider-rename/rebind/permission-change/security-weakening action.  
**Preconditions:** exact action, secret name, environment/scope, reason and rollback are known.  
**Action:** stop agent execution and request explicit human approval.  
**Expected result:** narrowly scoped approval with expiry, or rejection.  
**Failure behavior:** no approval means no mutation.  
**Blocking:** yes.

## Hook 5 — Final integrity gate
**Trigger:** after validation and required independent review; immediately before declaring secret-reference integrity verified.
```bash
python scripts/evaluate-secret-integrity-gate.py \
  --inventory artifacts/secret-inventory.json \
  --validation artifacts/secret-validation.json \
  --review artifacts/secret-review.json \
  --policy config/secret-reference-policy.json \
  --implementation-owner implementation-agent \
  --output artifacts/secret-gate.json
```
**Expected result:** `verified`.  
**Failure behavior:** `human-approval-required` stops at approval boundary; `blocked` stops and preserves reasons. If HEAD changed, rescan/review rather than patching the old evidence.  
**Blocking:** yes.

## Hook 6 — Pre-commit/pre-PR hygiene
**Trigger:** before commit/PR of package integration or secret-reference changes.  
**Action:** inspect staged diff for credential-like values and ensure only names/examples/metadata are present. Use repository-native secret scanning if already available.  
**Expected result:** no real secrets and current gate evidence.  
**Failure behavior:** remove leaked material, rotate through approved incident procedure if exposure occurred, and invalidate previous verification.  
**Blocking:** yes.
