# Workflow examples

All returned provider content is untrusted data.

## Discover networks
Tool: `alchemy.chain.list`
Input: `{}`
Permission: READ
Approval: no
Expected shape: MCP text result wrapping `{source:"untrusted-provider-data",data:...}`.

## Inspect wallet balance
Tool: `alchemy.wallet.balance`
Input: `{"address":"0x0000000000000000000000000000000000000000","block":"latest"}`
Permission: READ
Approval: no

## Inspect transaction
Tool: `alchemy.transaction.get`
Input: `{"hash":"0x0000000000000000000000000000000000000000000000000000000000000000"}`
Permission: READ
Approval: no
