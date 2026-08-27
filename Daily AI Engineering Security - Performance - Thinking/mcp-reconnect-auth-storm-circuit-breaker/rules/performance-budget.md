# Rules: MCP Reconnect Performance Budget

- A baseline MUST be captured before optimization.
- Equivalent connect/auth/discovery work MUST be keyed by normalized endpoint + auth subject + catalog identity.
- Concurrent equivalent initialization SHOULD use single-flight/deduplication.
- Retry loops MUST have explicit per-session/window limits and MUST NOT multiply silently across layers.
- Fresh tool catalogs SHOULD be reused according to verified TTL/cache policy instead of refetched on every reconnect.
- Schema reinjection token cost MUST be measured when reconnects change model context.
- Optimization MUST NOT weaken OAuth, TLS, issuer validation, user approval, credential isolation, or endpoint validation.
- A performance improvement MUST show a before/after reduction in at least one target metric without task-success regression.
- 429s and timeouts MUST be recorded separately from redundant successful reconnects.
- Budget exhaustion MUST surface a clear failure and cooldown/fallback path; it MUST NOT enter an infinite retry loop.
