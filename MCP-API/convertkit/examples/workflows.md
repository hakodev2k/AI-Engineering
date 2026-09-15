# Workflows

## Audience review
Call `convertkit.subscriber.list` with `{ "per_page": 100 }`, then `convertkit.subscriber.stats` for selected IDs. Both are READ and require no approval.

## Apply a tag
Call `convertkit.tag.list`, choose a tag, then prepare `convertkit.tag.subscriber` with `tag_id` and `subscriber_id`. This is WRITE and requires a payload-bound `approval_token` by default.

## Broadcast analysis
Call `convertkit.broadcast.list`, then `convertkit.broadcast.stats` and `convertkit.broadcast.clicks`. These are READ operations.

## Unsubscribe
`convertkit.subscriber.unsubscribe` is DESTRUCTIVE. It requires `KIT_ENABLE_DESTRUCTIVE=true` plus a payload-bound approval token. It is never retried automatically.

Outputs preserve Kit's response shape inside `{ "untrusted_provider_data": true, "data": ... }`.