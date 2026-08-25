# Plaid MCP workflow examples

## Reconcile recent transaction changes

Tool: `plaid.transactions.sync`

Input:
```json
{
  "access_token": "<managed-by-connector>",
  "cursor": "<previous-cursor>",
  "count": 100
}
```

Permission: `READ`
Approval: not required
Expected output shape: Plaid sync payload containing `added`, `modified`, `removed`, `next_cursor`, and `has_more`, wrapped as untrusted provider data.

## Review investments

1. Call `plaid.investments.holdings.get` with the Item access token.
2. Call `plaid.investments.transactions.get` with an explicit date range and pagination.
3. If freshness is insufficient, obtain explicit approval and call `plaid.investments.refresh`.

`plaid.investments.refresh` permission: `WRITE`; approval required by default. The connector will not retry this refresh blindly.

## Retrieve ACH-routing data

Tool: `plaid.auth.get`

Input:
```json
{
  "access_token": "<managed-by-connector>",
  "approval_id": "<human-approval-hmac>"
}
```

Permission: `HIGH_RISK`
Approval: always required
Expected output shape: Plaid Auth response including user-authorized account and routing details. Treat this output as sensitive data and do not persist it unless the calling application has a justified retention policy.

## Refresh transactions

Tool: `plaid.transactions.refresh`

Input:
```json
{
  "access_token": "<managed-by-connector>",
  "approval_id": "<human-approval-hmac>"
}
```

Permission: `WRITE`
Approval: required by default
Expected output shape: Plaid refresh acknowledgement. Fresh transaction changes should subsequently be read with `plaid.transactions.sync`.
