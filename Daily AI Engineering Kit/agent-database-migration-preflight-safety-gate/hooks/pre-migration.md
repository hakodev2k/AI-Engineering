# Pre-Migration Hook

**Trigger:** before an agent proposes merge/execution of a migration.

**Preconditions:** generated SQL exists locally and is traceable to the requested migration.

**Action:** run `python scripts/preflight.py --input <generated.sql> --policy config/policy.yaml --output preflight-result.json`.

**Expected result:** exit 0 for `pass`; exit 2 for `approval_required`; exit 3 for `block`; validation/tool errors use nonzero error codes documented by the script.

**Failure behavior:** `block` and validation/tool errors stop execution. `approval_required` blocks any migration execution until explicit human approval. Preserve the JSON result as evidence.

**Blocking:** yes. This hook never applies a migration.
