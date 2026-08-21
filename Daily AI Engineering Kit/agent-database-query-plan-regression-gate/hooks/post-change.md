# Hook: Post-change Verification Gate

**Trigger:** after query-affecting edits and relevant functional tests.

**Preconditions:** baseline and candidate plan files exist and were captured comparably.

**Action:** run deterministic plan comparison, then independent verification.

**Command:**
```bash
python scripts/query_plan_gate.py --baseline <baseline> --candidate <candidate> --output plan-report.json --max-cost-ratio 1.30 --max-row-ratio 2.0 --forbid-new-seq-scan
```

**Expected result:** exit 0, report status `pass`, functional tests/build already successful.

**Failure behavior:** preserve report; invoke regression triage. Maximum two fix cycles, then stop.

**Blocking:** yes.