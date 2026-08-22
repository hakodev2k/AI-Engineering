# Pre-task Hook

**Trigger:** before investigation or editing.

**Preconditions:** Git repository, readable working tree, Python 3, known diff base.

**Action:** run `python <package-root>/scripts/scan-side-effects.py --base <base> --output .ai/transaction-side-effects.json` and preserve the report.

**Expected result:** exit 0 means no heuristic candidates; exit 1 means candidates require investigation; exit 2 means scanner/tool failure.

**Failure behavior:** exit 1 does not block investigation but blocks a clean declaration. Exit 2 blocks execution until the environment/tool issue is resolved. Never interpret tool failure as no findings.

**Blocking:** yes for exit 2; no for exit 1 if the investigator proceeds.
