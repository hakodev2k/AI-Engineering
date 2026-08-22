# Lifecycle Hooks

## Pre-task repository scan
- Trigger: before investigation or edits.
- Preconditions: repository readable, Python 3 available.
- Action: `python scripts/scan-locks.py <repo> --json > lock-scan.json`.
- Expected: inventory/findings generated.
- Failure: exit 2 for high/critical findings is evidence, not a tool failure; missing Python/path blocks the hook.
- Blocking: blocks completion, not investigation.

## Post-edit lock scan
- Trigger: after lock-related edits.
- Action: rerun scanner and compare findings with baseline.
- Expected: no new high/critical findings.
- Failure: return to implementation, maximum two test-fix cycles.
- Blocking: yes for verification.

## Test hook
- Trigger: before independent verification.
- Action: run project-native build/tests plus explicit contention, expiry, stale-owner tests identified by the workflow.
- Expected: all relevant commands exit zero.
- Failure: preserve output; no test disabling or assertion weakening.
- Blocking: yes.

## Final evidence hook
- Trigger: final gate.
- Action: `python scripts/verify-evidence.py <report.json>`.
- Expected: exit 0 and report status `pass`.
- Failure: correct evidence or unresolved implementation; never relabel a failure as pass.
- Blocking: yes.
