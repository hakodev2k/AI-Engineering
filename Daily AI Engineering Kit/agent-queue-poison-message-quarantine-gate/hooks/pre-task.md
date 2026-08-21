# Pre-task Hook

**Trigger:** before investigation or edits.

**Preconditions:** run from target repository root with Python 3.9+.

**Action:** run `python scripts/scan_queue_handlers.py . --output queue-gate-findings.json` after copying this kit into the repository or adjust the script path to the kit location.

**Expected result:** JSON inventory of suspicious retry/ack/error-handling signals for human/agent triage. Exit 0 means no high-risk static signal; exit 1 means at least one high-risk signal; exit 2 means invalid invocation/environment.

**Failure behavior:** exit 1 does not prove a defect but blocks blind implementation until findings are inspected. Exit 2 blocks execution.

**Blocking:** yes for environment errors and unreviewed high-risk findings.