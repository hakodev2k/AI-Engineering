# Skill: Quarantine Remediation

## Purpose
Restore quarantined coverage and safely remove the registry entry.

## Inputs
Quarantine entry, reproduction evidence, suspect code/tests, owner acceptance criteria.

## Process
1. Re-run the quarantined test repeatedly in a controlled environment.
2. Trace shared state, time, randomness, concurrency, network, filesystem, database, and ordering dependencies.
3. Form one hypothesis at a time.
4. Implement the smallest deterministic fix.
5. Run targeted repetition sufficient to exercise the original failure mode.
6. Run relevant surrounding suite and host build/static checks.
7. Remove quarantine/skip only after targeted stability evidence passes.
8. Inspect diff for accidental coverage reduction or broad retry logic.
9. Hand evidence to independent Verification Agent.

## Retry policy
Maximum two fix/retest cycles. Preserve each failure log. Escalate after the second failed cycle.

## Output
Root cause, change, verification commands/results, quarantine disposition, residual risk.

## Stop conditions
Unknown root cause after bounded retries, required production mutation, security weakening, or approval-required action.
