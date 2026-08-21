# Hook: Post-action Convergence Gate

## Trigger
After every expensive tool/model action and immediately after context compaction/resume.

## Preconditions
The objective ledger records the action target and its resulting evidence gain.

## Action
Run the convergence guard, verify the latest action changed a named criterion/blocker or produced explicit partial evidence, and compare any progress claim to phase evidence.

## Command
`python3 scripts/convergence_guard.py objective-ledger.json`

## Expected result
Exit 0, no unsupported progress claims, and no repeated no-gain streak requiring strategy reset.

## Failure behavior
Exit 2 blocks for malformed/missing state. Exit 3 requires strategy reset or autonomous checkpoint/stop according to the JSON output. The agent MUST NOT simply continue the same action family.

## Blocking
Yes for unsupported progress claims, three-cycle low-gain condition, or malformed convergence state. A two-action no-gain streak blocks equivalent retries until the hypothesis changes.