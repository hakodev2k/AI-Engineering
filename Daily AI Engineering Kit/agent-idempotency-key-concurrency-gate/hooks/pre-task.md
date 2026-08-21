# Pre-task Hook

Trigger: before investigation or implementation.

Preconditions: repository path is available.

Action:
1. Confirm repository is readable and Git state is understood.
2. Run `python scripts/scan-idempotency.py <repo> --output idempotency-scan.json`.
3. Record scanner output as a lead, not a final finding.

Expected result: repository context plus idempotency signals are available.

Failure behavior: invalid repository or unreadable source blocks execution. Scanner exit code 1 means review is required and does not itself prove a defect.

Blocking: repository validation failure blocks; missing static signals do not.
