# Hook: Pre-task Pagination Gate

**Trigger:** before an agent edits pagination/list-query/cursor code.

**Preconditions:** repository checkout is readable and Python 3 is available.

**Action:** run `python scripts/scan-pagination.py --root . --out pagination-findings.json` from the package root (or adjust script path after copying the kit).

**Expected result:** JSON evidence is created. Exit 0 means no blocking static signal; exit 1 means at least one high/critical signal requiring investigation; exit 2 means execution/configuration failure.

**Failure behavior:** exit 1 blocks blind implementation but permits evidence-based investigation. Exit 2 blocks editing until the environment/input problem is resolved. Tool execution may be retried at most twice for transient failures.

**Blocking:** yes for high/critical signals and execution failure.
