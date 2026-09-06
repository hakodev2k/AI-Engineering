# Appwrite connector workflows

## Inspect a project
1. `appwrite.context.get` — READ, official MCP, no approval.
2. `appwrite.user.list` / `appwrite.storage.bucket.list` / `appwrite.function.list` — READ, official MCP first; REST fallback when configured.

## Provision a user
1. Read existing users.
2. Prepare `appwrite.user.create` input.
3. Approve the exact connector fingerprint `appwrite.user.create:<userId>` when write approval is enabled.
4. Execute creation.

## Execute a function
1. `appwrite.function.get` to inspect configuration.
2. Review the body/path.
3. Approve `appwrite.function.execution.create:<functionId>`.
4. Execute. This tool is always HIGH_RISK.

## Destructive cleanup
`appwrite.user.delete`, `appwrite.storage.bucket.delete`, and `appwrite.function.delete` require both `APPWRITE_ALLOW_DESTRUCTIVE=true` and an exact approval fingerprint.
