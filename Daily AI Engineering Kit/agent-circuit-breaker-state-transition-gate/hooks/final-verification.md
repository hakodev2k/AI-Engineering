# Final Verification Hook

**Trigger:** after implementation/tests and before declaring success.

**Preconditions:** investigation and implementation artifacts exist.

**Action:** run focused/relevant tests, run `python scripts/validate-circuit.py <evidence.json>` where evidence exists, inspect the final diff, verify approval records, and ensure the verifier is independent of the implementation owner.

**Expected result:** tests and validator exit 0, diff contains only intended changes, approval requirements are satisfied.

**Failure behavior:** mark verification `failed` for deterministic/test/diff failures or `blocked` for missing permission/approval/environment. Never convert execution success into verification success.

**Blocking:** yes.
