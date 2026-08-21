# Recovery Hooks

## Pre-retry policy validation
Trigger: before entering a retry loop. Preconditions: repository root and Python 3 available. Action: `python scripts/validate_policy.py config/policy.json`. Expected: `policy valid`, exit 0. Failure: block retry execution.

## Attempt evidence capture
Trigger: after each deterministic command attempt. Action: `scripts/retry_gate.py` writes `.ai-retry-evidence.json` with attempt number, exit code, duration and bounded stdout/stderr tails. Expected: evidence file is parseable JSON. Failure: block further automated retries because audit evidence is incomplete.

## Final verification
Trigger: command returns success. Action: run the task-specific postcondition/test outside the retry wrapper and inspect `.ai-retry-evidence.json`. Expected: intended state is verified and attempts do not exceed policy. Failure: classify as validation failure; do not automatically repeat a state-changing command.

## Circuit checkpoint
Trigger: dependency failures accumulate. Action: caller records consecutive dependency failures and blocks calls when threshold 5 is reached for 60 seconds. Expected: no requests while open except one controlled probe after cool-down. Failure: stop automated execution and escalate.
