# Skill: Flaky Test Investigation
## Purpose
Determine whether a failing test is nondeterministic, a real defect, or environment failure.
## Inputs
Test id, recent CI runs, logs, seed/timing/environment data, nearby code and tests.
## Process
1. Identify exact test entry point and dependencies.
2. Collect at least three relevant historical executions when available.
3. Separate product assertion failures from infrastructure/tool failures.
4. Re-run with stable seed/config where supported.
5. Vary one suspected nondeterministic factor at a time.
6. Trace shared state, clocks, randomness, network, filesystem, concurrency, and test-order dependencies.
7. Record facts, hypotheses, evidence, and unknowns separately.
8. Reproduce a deterministic product defect before rejecting quarantine.
9. If nondeterminism is supported, hand evidence to Quarantine Reviewer.
## Verification
A flaky classification needs contradictory outcomes under materially equivalent inputs or a confirmed nondeterministic mechanism.
## Failure handling
Transient history/tool collection retries max 2. Missing evidence blocks automatic quarantine.
## Stop conditions
Potential security defect, production data access, destructive setup, or insufficient evidence requiring human review.
