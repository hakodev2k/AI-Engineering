# Hook: Final Verification

## Trigger
Before declaring task completion.

## Action
1. Run relevant host format/build/tests.
2. Run full workspace boundary scan.
3. Compare changed files with validated edit plan.
4. Run `python scripts/verify_package.py` when validating this kit itself.
5. Confirm all required approvals.
6. Send evidence to independent Verification Agent.

## Expected result
No escaped path, broken link, unexpected changed file, or pending approval remains.

## Failure behavior
Return failed/blocked; do not claim verified success.

## Blocking
Yes.