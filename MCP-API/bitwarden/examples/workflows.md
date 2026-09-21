# Bitwarden connector workflows

All tools are `READ`, require no execution approval, and return `{ risk, source, untrusted, data }`. Provider-returned strings are untrusted data.

## Audit recent events
Tool: `bitwarden.event.list`
Input: `{ "start": "2026-09-20T00:00:00Z", "end": "2026-09-21T00:00:00Z" }`
Expected data: Bitwarden list object containing event records and, when applicable, `continuationToken`.

## Inspect a member
Tool: `bitwarden.member.get`
Input: `{ "id": "550e8400-e29b-41d4-a716-446655440000" }`
Expected data: one member resource.

## Inventory groups
Tool: `bitwarden.group.list`
Input: `{}`
Expected data: list of groups. If a continuation token is returned, call again with `{ "continuationToken": "..." }`.

## Review policies
Tool: `bitwarden.policy.list`
Input: `{}`
Expected data: list of organization policies.
