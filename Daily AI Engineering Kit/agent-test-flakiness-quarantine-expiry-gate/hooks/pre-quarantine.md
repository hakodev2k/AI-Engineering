# Hook: Pre Quarantine

## Trigger
Before introducing skip/quarantine/exclusion for a test.

## Preconditions
Exact test id and reproduction command are known.

## Action
Run the Prove Flakiness skill; collect at least two comparable failures and two passes where feasible; identify owner and proposed expiry.

## Expected result
Evidence-backed quarantine request or rejection.

## Failure behavior
Insufficient evidence blocks quarantine. Transient runner failure retries at most twice.

## Blocking
Yes.
