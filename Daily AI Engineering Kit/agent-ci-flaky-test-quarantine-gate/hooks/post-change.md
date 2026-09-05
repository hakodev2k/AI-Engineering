# Hook: Post Change

## Trigger
After test, retry, fixture, synchronization, or quarantine changes.

## Action
1. Run targeted test repetitions using the host framework.
2. Run normal host build/test checks.
3. Run `python scripts/flaky_test_gate.py --history <history.json> --quarantine config/quarantine.json --policy config/flaky-test-policy.json --output <report.json>`.
4. Run `python scripts/verify_package.py`.
5. Preserve evidence for independent verification.

## Expected result
No blocking policy finding and no hidden deterministic failure.

## Failure behavior
Any expired/invalid quarantine or host failure blocks completion; implementation may retry at most twice.

## Blocking
Yes.
