# Hook: Final Verification

## Trigger
After implementation and tests, before declaring the ordering task complete.

## Preconditions
Post-change evidence exists and an independent verifier has access to the diff.

## Actions
1. Run `python scripts/message_order_gate.py --evidence <post-change-evidence.json> --policy config/policy.json`.
2. Run `python -m unittest discover -s tests -v` from the package root.
3. Run `python scripts/verify_package.py`.
4. Run the host repository's relevant build/test commands.
5. Inspect changed files for transport/config/database changes requiring approval.

## Expected result
All deterministic checks pass and the Verification Agent reports `verified`.

## Failure behavior
A failed deterministic check blocks completion. A repair cycle may run at most twice; preserve each failed result. Permission/environment failures stop as `inconclusive` rather than being converted to success.

## Blocking
Yes. Completion is forbidden without evidence-based verification and any required human approval.
