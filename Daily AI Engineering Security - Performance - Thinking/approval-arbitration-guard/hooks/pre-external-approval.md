# Hook — Pre External Approval

## Trigger
Immediately before an approval request is handed to an external approver.

## Preconditions
Request ID, current state, risk class and policy are available.

## Action
Validate the proposed `claim` or `defer` transition with the deterministic arbitrator.

## Command
```bash
python scripts/approval_arbitrator.py validate --state request.json --transition transition.json
```

## Expected result
Exit `0` and JSON status `allowed` for a policy-valid transition.

## Failure behavior
Exit `2` blocks external claim/decision. Exit `3` indicates malformed input/environment and also blocks external claim. The caller must defer to the native/human path or stop safely.

## Completion blocking
Yes. A failed hook MUST NOT be converted to approval.
