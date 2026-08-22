# Pre-Implementation Hook

**Trigger:** before edits.

**Preconditions:** repository and evidence path available.

**Action:** confirm clean/understood working tree, run discovery, then `python scripts/validate_evidence.py <evidence.json>`.

**Expected result:** schema-valid evidence with status `ready`.

**Failure:** block edits on invalid/blocked evidence. Existing unrelated changes must be recorded and preserved; never reset them.

**Blocking:** yes.