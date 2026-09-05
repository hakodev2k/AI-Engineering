# Workflows

- Discover: `1password.vault.list` → `1password.item.list` → `1password.item.get_redacted`. READ, no approval.
- Audit: `1password.activity.list`. READ, no approval.
- Prepare item: `1password.item.create`. WRITE; approve exact fingerprint `1password.item.create:<vaultId>:<title>` when write approval is enabled.
- Replace item: `1password.item.replace`. WRITE; approve `1password.item.replace:<vaultId>:<itemId>`.
- Archive item: enable destructive mode and approve `1password.item.archive:<vaultId>:<itemId>`.

For runtime secret consumption by coding agents, prefer the official 1Password Environments MCP Server so secret values stay outside model context.
