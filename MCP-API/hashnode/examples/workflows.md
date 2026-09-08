# Workflow examples

## Research content
- `hashnode.user.get` input `{ "username": "example" }` — READ, no approval.
- `hashnode.feed.list` input `{ "first": 20 }` — READ, no approval.
- `hashnode.post.get` input `{ "id": "<post-id>" }` — READ, no approval.

## Draft then publish
1. `hashnode.draft.create` with `{ "publicationId":"<id>", "title":"Draft", "contentMarkdown":"...", "approved":true }` — WRITE.
2. `hashnode.draft.update` — WRITE.
3. `hashnode.draft.publish` with `{ "draftId":"<id>", "approved":true }` — HIGH_RISK because it publishes public content.

## Removal
`hashnode.post.remove` is DESTRUCTIVE and requires both `approved:true` and `HASHNODE_ENABLE_DESTRUCTIVE=true`.

Outputs are wrapped as `{ provider: "hashnode", untrusted_data: true, result: ... }`.
