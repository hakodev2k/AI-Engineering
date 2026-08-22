# Hook: Pre-task Repository Validation

**Trigger:** before exploration or edits.

**Preconditions:** repository checkout and intended test target are known.

**Action:** confirm the repository is readable; capture `git status --short` and current branch; identify pre-existing changes; confirm the replay target is local/test; run `python scripts/scan-replay-risk.py <repository-root> --output replay-risk.json`.

**Expected result:** repository baseline and candidate side-effect files are recorded without mutation.

**Failure behavior:** scanner/tool failure may be retried twice. An unknown dirty diff is blocking until understood. A production replay target is blocking unless separately approved; this hook itself never authorizes production execution.

**Blocks execution:** yes for unsafe target, unreadable repository, or unexplained conflicting changes; no for scanner findings, which feed investigation.
