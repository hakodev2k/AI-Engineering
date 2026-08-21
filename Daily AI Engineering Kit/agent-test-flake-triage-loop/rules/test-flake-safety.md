# Test Flake Safety Rules

## MUST
- Preserve the original failing command, environment facts, logs, and observed symptom before editing code.
- Distinguish deterministic failures from intermittent failures using repeated executions.
- Record every hypothesis with supporting and contradicting evidence.
- Prefer the smallest production or test-infrastructure change that removes nondeterminism while preserving intended behavior.
- Run the affected test repeatedly after a change and run the nearest relevant test suite at least once.
- Inspect the final diff for unrelated changes.
- Stop before any approval-required action listed in `config/flake-triage.yaml`.

## MUST NOT
- Do not delete, skip, ignore, mute, or permanently quarantine a flaky test merely to make CI green.
- Do not weaken assertions, increase tolerances, add arbitrary sleeps, or add retries as the sole fix without explicit approval and documented justification.
- Do not change production behavior without evidence connecting it to the failure.
- Do not run destructive database, infrastructure, or repository-history commands.
- Do not expose secrets from logs or environment variables in reports.
- Do not claim a flake is fixed from a single passing run.

## SHOULD
- Seed random generators when reproducibility is relevant.
- Isolate time, network, filesystem, and concurrency dependencies where feasible.
- Prefer condition-based waits over fixed sleeps.
- Keep evidence files small and targeted.
- Escalate unknown flakes when the configured reproduction budget is exhausted.