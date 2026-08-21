# Cache Safety Rules

## MUST
- Every cached LLM response must have an explicit isolation boundary.
- Tenant and data-scope identifiers must be included when authorization or retrieved data differs by tenant/scope.
- Raw prompts, secrets, bearer tokens, API keys, and credentials must not appear in cache keys.
- Prompt/tool/response-format values used for keying must be canonicalized and hashed.
- Cache namespace/version must change when key semantics change.
- Tests must prove that materially different authorization or response inputs do not collide.
- Cache TTL must not exceed `config/cache-policy.yaml`.
- A missing required isolation field must block caching rather than silently fall back.

## MUST NOT
- Do not use a global key for tenant-specific or user-specific outputs.
- Do not reuse cached output across authorization scopes without explicit evidence that the response is identical and safe to share.
- Do not purge or rewrite production cache entries without explicit human approval.
- Do not log full prompts or sensitive retrieved context merely to debug key generation.
- Do not weaken authorization checks because a response came from cache.
- Do not treat a cache hit as evidence that the caller is authorized to consume the cached value.

## SHOULD
- Prefer content hashes and stable identifiers over large raw key fragments.
- Keep cache-key generation deterministic and side-effect free.
- Emit structured metrics for hits, misses, blocks, and policy violations without sensitive payloads.
- Keep a bounded TTL even when source data appears static.
- Add targeted regression tests whenever a prompt, tool schema, authorization model, or retrieval scope changes.
