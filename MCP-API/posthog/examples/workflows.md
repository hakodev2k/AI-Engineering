# PostHog connector workflows

## Review product state
1. `posthog.dashboard.list` with `{ "limit": 20 }` — READ, no approval.
2. `posthog.insight.list` with `{ "search": "activation" }` — READ, no approval.
3. `posthog.feature_flag.list` — READ, no approval.

## Create a rollout flag
Tool: `posthog.feature_flag.create` — WRITE, approval required.
```json
{"key":"new-checkout","name":"New checkout","active":true,"filters":{"groups":[{"properties":[],"rollout_percentage":10}]},"approval_token":"<payload-bound HMAC>"}
```
Expected output is the created PostHog feature-flag object wrapped with `untrusted_provider_data: true`.

## Disable a risky flag
Tool: `posthog.feature_flag.update` — HIGH_RISK, approval required.
```json
{"id":123,"changes":{"active":false},"approval_token":"<payload-bound HMAC>"}
```

## Delete a stale flag
Tool: `posthog.feature_flag.delete` — DESTRUCTIVE, approval required, and `POSTHOG_ENABLE_DESTRUCTIVE=true` must be configured outside the agent.
