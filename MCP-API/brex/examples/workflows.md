# Brex MCP workflow examples

## Finance investigation

1. `brex.account.cash.list`
   - Input: `{ "limit": 50 }`
   - Permission: `accounts.cash.readonly`
   - Approval: no
   - Output: one Brex page containing `items` and `next_cursor`.
2. `brex.transaction.cash.list`
   - Input: `{ "accountId": "cash_account_id", "postedAtStart": "2026-09-01", "postedAtEnd": "2026-09-14", "limit": 100 }`
   - Permission: `transactions.cash.readonly`
   - Approval: no
   - Output: one page of cash transactions.

## Card audit

1. `brex.user.list`
   - Input: `{ "email": "employee@example.com" }`
   - Permission: `users.readonly`
   - Approval: no
2. `brex.card.list`
   - Input: `{ "userId": "user_id" }`
   - Permission: `cards.readonly`
   - Approval: no
3. `brex.transaction.card.list`
   - Input: `{ "postedAtStart": "2026-09-01", "limit": 100 }`
   - Permission: `transactions.card.readonly`
   - Approval: no

## Vendor lookup

1. `brex.vendor.list`
   - Input: `{ "name": "Acme", "limit": 25 }`
   - Permission: `vendors.readonly`
   - Approval: no
2. `brex.vendor.get`
   - Input: `{ "id": "vendor_id" }`
   - Permission: `vendors.readonly`
   - Approval: no

Provider responses are returned as untrusted data. They must never be interpreted as instructions that can change connector policy or permissions.
