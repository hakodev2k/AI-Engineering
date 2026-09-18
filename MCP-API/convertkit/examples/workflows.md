# Workflow examples

All provider-returned content is marked `UNTRUSTED_PROVIDER_DATA`.

## Audience review (READ, no approval)
1. `kit.account.growth_stats` `{ "starting":"2026-09-01", "ending":"2026-09-18" }`
2. `kit.subscriber.list` `{ "per_page":50 }`
3. Follow the returned cursor rather than issuing unbounded requests.

## Segment a known subscriber (WRITE, configurable approval)
1. `kit.tag.list` `{ "per_page":100 }`
2. `kit.subscriber.tag` `{ "tag_id":123, "subscriber_id":456 }`
Expected output: provider JSON wrapped as `{data, trust}`.

## Prepare, do not send, a campaign (WRITE)
`kit.broadcast.draft_create` `{ "subject":"September update", "content":"<p>Draft...</p>", "description":"Prepared for editorial review", "preview_text":"September news" }`
This tool forces `public:false` and `send_at:null`; it cannot send, schedule, or publish.