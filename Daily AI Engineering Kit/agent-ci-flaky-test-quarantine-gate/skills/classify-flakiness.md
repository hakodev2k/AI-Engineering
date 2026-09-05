# Skill: Classify Flakiness

## Purpose
Determine whether a failing test has credible intermittent behavior rather than a deterministic defect.

## Inputs
CI history, test identity, commits, attempts, environment metadata, policy.

## Preconditions
History refers to real executions and test identity is stable.

## Allowed tools
Read-only CI logs, repository search, deterministic scripts, local non-production test execution.

## Process
1. Normalize all observations for the exact test.
2. Remove invalid duplicates; never fabricate observations.
3. Run `scripts/flaky_test_gate.py`.
4. Confirm both passes and failures exist across the required observation window.
5. Compare failing and passing commits, environments, order, timing, seed, and parallelism.
6. If all failures correlate with one code/config state, classify as deterministic until disproven.
7. Record facts, hypotheses, evidence, and open questions separately.
8. Hand credible intermittent cases to Root Cause Flaky Test.

## Expected output
Classification, counts, failure rate, evidence, confidence, suspected trigger, affected test.

## Verification
Flaky classification requires policy thresholds plus evidence that outcomes vary without a relevant product-code change.

## Failure handling
Missing history blocks classification. Transient CI retrieval retries at most twice.

## Stop conditions
Insufficient observations, unstable test identity, or evidence of deterministic regression.
