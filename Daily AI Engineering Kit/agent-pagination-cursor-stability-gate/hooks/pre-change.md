# Hook: Pre-change Cursor Validation

**Trigger:** before pagination edits.

**Preconditions:** trace and policy files exist.

**Action:** `python scripts/pagination_cursor_gate.py --trace examples/unstable-trace.json --policy config/policy.json --out .cursor-gate/pre-change.json`

**Expected result:** exit 1 for the packaged unstable fixture. A project trace records its actual baseline result.

**Failure behavior:** exit 2 blocks until trace/config input is repaired.

**Blocks execution:** yes for invalid inputs; a valid failing project trace proceeds to bounded remediation.
