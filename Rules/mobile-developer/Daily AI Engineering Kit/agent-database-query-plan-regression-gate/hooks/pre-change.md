# Hook: Pre-change Evidence Gate

**Trigger:** before editing a database-affecting query.

**Preconditions:** query entry point identified; diagnostic environment authorized.

**Action:** capture generated SQL and baseline plan; record environment/parameter facts.

**Command:** plan capture is engine/project specific; after capture validate it with `python scripts/query_plan_gate.py --baseline <plan> --candidate <same-plan> --output precheck.json`.

**Expected result:** exit 0 and a parseable baseline.

**Failure behavior:** block editing when baseline is required but invalid/unavailable; permission failures require escalation.

**Blocking:** yes, unless a human explicitly waives baseline comparison and defines alternative evidence.