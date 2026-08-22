# Lifecycle Hooks

## Pre-task repository scan
- Trigger: before investigation or implementation.
- Preconditions: repository root exists.
- Action: run `python scripts/scan-pool-risk.py <repo> --json` and preserve output.
- Expected result: baseline risk report.
- Failure behavior: tool error may be retried once; persistent failure blocks verified completion.
- Blocking: yes for verified completion.

## Post-edit pool safety scan
- Trigger: after edits affecting database access, concurrency, retries, transactions, or DI lifetimes.
- Preconditions: changed files saved.
- Action: re-run `python scripts/scan-pool-risk.py <repo> --json`.
- Expected result: no unresolved high-risk pattern.
- Failure behavior: enter bounded fix-retest loop; maximum 2 cycles.
- Blocking: yes.

## Final assessment validation
- Trigger: before workflow completion.
- Preconditions: assessment JSON exists and test/diff evidence is recorded.
- Action: run `python scripts/validate-assessment.py <assessment.json>`.
- Expected result: `assessment-valid` and exit code 0.
- Failure behavior: correct contract/evidence mismatch only when supported by facts; never weaken evidence requirements.
- Blocking: yes.

## Approval guard
- Trigger: before connection-string/pool-setting, schema, destructive SQL, infrastructure, secret, production config, or deployment changes.
- Preconditions: proposed action identified.
- Action: stop and obtain explicit human approval.
- Expected result: approval recorded in the assessment or action remains unexecuted.
- Failure behavior: remain `needs-approval`.
- Blocking: yes.
