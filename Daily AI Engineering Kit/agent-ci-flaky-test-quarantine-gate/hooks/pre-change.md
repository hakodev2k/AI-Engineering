# Hook: Pre Change

## Trigger
Before editing a failing test, retry policy, skip marker, or quarantine registry.

## Preconditions
History and policy are available.

## Action
Run the gate against current history/registry, capture baseline test results, identify whether the test already has quarantine, and preserve evidence.

## Command
`python scripts/flaky_test_gate.py --history <history.json> --quarantine config/quarantine.json --policy config/flaky-test-policy.json --output <baseline-report.json>`

## Expected result
Baseline classification and registry state are explicit.

## Failure behavior
Invalid evidence blocks. Transient CI retrieval may retry twice.

## Blocking
Yes.
