# Hook: Pre-Decision Authority Check

## Trigger
Immediately before a consequential mutation, scope expansion, irreversible operation, or completion claim.

## Preconditions
A structured decision JSON and authority registry exist. Required canonical reads have either succeeded or are explicitly marked unavailable.

## Action
Run the authority/freshness gate. Do not perform the protected action unless the result is `allow` and any required approval is present.

## Script/command
```bash
python scripts/authority_freshness_gate.py decision.json --registry config/authority-registry.example.json --json-out decision-gate-report.json
```

## Expected result
Exit `0` for `allow`, `2` for `revalidate`, `3` for `block`, and `1` for invalid input/runtime error.

## Failure behavior
`revalidate` refreshes only listed critical facts within the bounded retry budget. `block` stops the action and escalates. Runtime/input failure also blocks high-impact actions.

## Blocks completion
Yes for protected actions and high-impact completion claims.
