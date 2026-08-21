# Hook: Final Verification

**Trigger:** after pagination changes and before task completion.

**Preconditions:** implementation and focused tests exist; verifier has the diff.

**Action:** run scanner, `python scripts/verify-fixture.py --fixture examples/pagination-fixture.json`, project formatter/build/tests, then inspect changed files.

**Expected result:** fixture exits 0; project checks pass; verifier records evidence for every applicable checklist item.

**Failure behavior:** return to implementer for at most one correction cycle when failure is caused by the change. A second unchanged-category failure stops and escalates with logs. Permission/environment failures stop immediately after evidence collection.

**Blocking:** yes. Completion requires independent `verified` status. Approval-required changes stop before execution until explicit human approval exists.
