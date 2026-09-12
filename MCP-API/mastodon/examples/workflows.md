# Mastodon MCP workflows

## Read public timeline
Tool: `mastodon.timeline.public`
Input: `{ "limit": 10, "local": true }`
Permission: READ
Approval: no
Expected output: MCP text content containing provider metadata and an array of Status objects.

## Search statuses
Tool: `mastodon.search`
Input: `{ "q": "dotnet", "type": "statuses", "limit": 10 }`
Permission: READ
Approval: no
Expected output: accounts/statuses/hashtags search result object.

## Publish a status
Tool: `mastodon.status.create`
Input: `{ "status": "Release notes are live.", "visibility": "public", "approval": "approved-high-risk" }`
Permission: HIGH_RISK
Approval: explicit high-risk approval and `MASTODON_ALLOW_HIGH_RISK=true`
Expected output: created Status object.

## Bookmark a status
Tool: `mastodon.status.bookmark`
Input: `{ "id": "123456789", "approval": "approved" }`
Permission: WRITE
Approval: explicit write approval and `MASTODON_ALLOW_WRITES=true`
Expected output: updated Status object with `bookmarked: true` when supported by the instance.

## Delete your own status
Tool: `mastodon.status.delete`
Input: `{ "id": "123456789", "delete_media": false, "approval": "approved-destructive" }`
Permission: DESTRUCTIVE
Approval: destructive operations must be enabled and strongly approved.
Expected output: deleted Status representation returned by Mastodon.
