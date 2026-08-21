# Hook — Pre-Commit Governance Check

## Trigger
Immediately before a compacted context candidate replaces the current context.

## Preconditions
Authoritative ledger snapshot exists; candidate references are extractable as JSON; last known-good context is retained.

## Action
Run:

`python scripts/governance_coverage.py required.json candidate-pins.json`

## Expected result
Exit `0`: every active required constraint is present with matching version/hash/scope state. Candidate may proceed to policy-decision parity testing and commit.

## Failure behavior
- Exit `2`: invalid input/schema; block commit.
- Exit `4`: missing, stale, mismatched, or unexpected active governance reference; block commit and preserve previous context.

## Blocking
Yes. Validation failure MUST prevent the compacted candidate from becoming authoritative.
