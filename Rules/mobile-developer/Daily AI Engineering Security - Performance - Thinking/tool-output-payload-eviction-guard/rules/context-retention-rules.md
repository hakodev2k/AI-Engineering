# Context Retention Rules

- The harness MUST measure both serialized bytes and estimated tokens before retaining a tool result above the soft threshold.
- It MUST NOT append raw binary/base64 payloads to durable history when a verified reference is sufficient.
- It MUST assign every large payload a lifecycle class.
- It MUST preserve lossless access to `exact-round-trip` data until all declared consumers finish.
- It MUST NOT silently truncate payloads required for correctness.
- It MUST deduplicate identical payloads by cryptographic hash.
- It MUST reserve at least 10% of the configured hard request/context limit as emergency headroom unless the provider requires a larger reserve.
- It MUST block a model dispatch whose projected serialized request reaches 90% of a known hard byte limit.
- It SHOULD begin eviction/externalization at 70% projected utilization.
- It MUST record original and retained sizes for every transformed payload.
- It MUST NOT place secrets in logs, previews, or unapproved artifact stores.
- Recovery retries MUST be bounded to two attempts and MUST NOT weaken correctness or security constraints.
- Completion MUST be blocked when an exact-payload hash verification fails.