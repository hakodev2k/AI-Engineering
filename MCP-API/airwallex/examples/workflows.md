# Airwallex workflow examples

## Inspect liquidity
Tool: `airwallex.balance.current`
Input: `{ "account_type": "cash" }`
Permission: READ
Approval: no
Expected shape: `{ "risk": "READ", "data": [{ "currency": "USD", "available_amount": 1000 }] }`

## Review payout history
Tool: `airwallex.transfer.list`
Input: `{ "status": "PAID", "page_size": 50 }`
Permission: READ
Approval: no
Expected shape: paginated transfer data from Airwallex.

## Validate before paying
Tool: `airwallex.transfer.validate`
Input: `{ "request_id": "12345678-abcd", "transfer_amount": 125, "transfer_currency": "USD", "beneficiary_id": "ben_example" }`
Permission: READ
Approval: no
Expected shape: validation result; no transfer is created.

## Create a transfer
Tool: `airwallex.transfer.create`
Input: same validated transfer payload plus any scenario-specific fields required by Airwallex.
Permission: HIGH_RISK
Approval: requires the operator to set `AIRWALLEX_HIGH_RISK_MODE=allow` outside the model context.

## Cancel an eligible transfer
Tool: `airwallex.transfer.cancel`
Input: `{ "id": "tr_example" }`
Permission: DESTRUCTIVE
Approval: requires the operator to set `AIRWALLEX_HIGH_RISK_MODE=allow` outside the model context.
