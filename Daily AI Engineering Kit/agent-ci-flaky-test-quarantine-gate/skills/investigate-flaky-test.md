# Investigate Flaky Test

## Purpose
Determine whether a CI test failure is deterministic, infrastructure-related, or genuinely nondeterministic without masking a product regression.

## When to use
After a reproducible test identity and failing CI observation are available.

## Inputs
Test ID, revision SHA, command, environment fingerprint, failure output, timestamps, and existing history.

## Preconditions
Repository revision is known; rerunning the test is safe; secrets are redacted from captured evidence.

## Allowed tools
Read-only repository search, CI logs, test runner, local/sandbox execution, and `scripts/flaky_gate.py`.

## Constraints
Do not change code while gathering baseline evidence. Do not count runner outages as test outcomes. Never rerun more than policy permits.

## Procedure
1. Capture the original failing test ID, revision, command, environment fingerprint, and normalized failure signature.
2. Inspect nearby implementation and tests to identify shared state, time, randomness, ordering, network, database, and concurrency dependencies.
3. Record facts separately from hypotheses.
4. Rerun only the smallest reliable scope at the same revision and materially equivalent environment.
5. After each valid execution, append exactly one `pass` or `fail` observation.
6. Stop when the policy rerun cap is reached or sufficient mixed evidence exists.
7. Run `python scripts/flaky_gate.py evaluate --evidence <file> --policy config/policy.json`.
8. If all valid observations fail with a stable signature, classify as deterministic regression and stop quarantine processing.
9. If mixed pass/fail outcomes exist and policy gates pass, hand off a quarantine proposal with suspected causes and evidence.
10. Preserve logs and unresolved risks.

## Expected output
Schema-valid evidence plus gate output: `insufficient_evidence`, `deterministic_failure`, `stable_pass`, `protected_test`, or `quarantine_eligible`.

## Verification
Revision is stable, observation count is correct, invalid infrastructure attempts are excluded, and the deterministic script independently reproduces the classification.

## Failure handling
Tool/infrastructure failure: retry at most twice without counting it as a test outcome. Permission/environment mismatch: stop and escalate. Contradictory evidence: preserve it and classify as unresolved rather than guessing.

## Stop conditions
Retry cap reached; deterministic failure established; protected test detected; unsafe rerun required; or quarantine eligibility established.
