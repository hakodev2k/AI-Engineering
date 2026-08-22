# Pagination Safety Rules

## MUST
- Treat collection completeness as unverified until a documented terminal condition is observed.
- Preserve the exact failed page/cursor/offset and error when retrieval stops unexpectedly.
- Use stable ordering when the provider supports it; document when it does not.
- Detect repeated page targets/cursors and stop immediately on a loop.
- Track unique item identity separately from raw item count.
- Respect `max_pages`, `max_items`, request timeout, and bounded retry settings.
- Keep credentials outside repository files and logs.
- Require independent verification after code changes that affect pagination semantics.

## MUST NOT
- Do not treat HTTP 200 on the first page as proof of success.
- Do not silently drop failed pages or continue from an unknown state.
- Do not retry a failed page more than the configured retry budget.
- Do not weaken authentication, rate-limit handling, or TLS validation to make a run pass.
- Do not mutate remote resources while investigating pagination.
- Do not change public API contracts, production configuration, or deployment state without explicit human approval.

## SHOULD
- Prefer provider-supplied next links/cursors over reconstructing them.
- Prefer immutable sort keys for page-number/offset pagination.
- Test empty collections, exact page-size boundaries, final partial pages, repeated cursors, transient 429/5xx responses, and duplicate records.
- Record facts, hypotheses, decisions, evidence, and open questions separately.
