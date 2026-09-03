# Hook: Pre-Deploy Policy Parity

## Trigger
Before release/deployment of connector, AI-agent, credential, or endpoint-routing changes.

## Preconditions
Policy and adapter inventory represent the candidate release; synthetic negative-test results are recorded.

## Action
Run:

```bash
python scripts/verify_destination_policy.py --policy config/policy.example.json --inventory examples/adapter-inventory.example.json
python -m unittest tests/test_verify_destination_policy.py
```

## Expected result
Both commands exit 0 and the report contains no violations.

## Failure behavior
Block completion. Preserve the report and route findings to the adapter owner/security reviewer.

## Blocking
Yes.