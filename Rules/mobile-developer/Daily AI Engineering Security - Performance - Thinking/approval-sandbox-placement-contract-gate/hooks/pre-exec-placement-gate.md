# Hook: Pre-Execution Placement Gate

## Trigger
Immediately before executing a command whose approval or placement is governed by agent policy.

## Preconditions
A compiled JSON command contract exists and `config/placement-policy.json` is readable. Any broker identity must already be resolved from trusted local configuration.

## Action
Run:

```bash
python3 scripts/placement_policy_gate.py <contract.json> --policy config/placement-policy.json
```

Exit codes:
- `0`: execute using the returned effective placement.
- `3`: human approval required; do not execute until action-bound approval is supplied and the gate is rerun.
- `4`: trusted broker required or broker contract incomplete; do not execute directly.
- `5`: deny.
- `2`: invalid policy/contract; deny.

## Expected result
A JSON decision that explicitly states approval, requested placement, effective placement, broker status, protected invariants, capabilities, and reasons.

## Failure behavior
Fail closed. A gate failure MUST NOT be bypassed by disabling denied-read paths or by converting placement to direct unsandboxed execution. If sandbox placement is safe and was requested, the command may proceed only on a fresh `allow_sandbox` result.

## Blocking
Yes. Any result other than exit `0` blocks the current execution path.
