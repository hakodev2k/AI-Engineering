# Pagination Safety Rules

## MUST
- Every paginated query MUST define a deterministic ordering that ends in a unique immutable tie-breaker such as primary key.
- Cursor contents MUST encode all ordering keys needed to resume strictly after the last emitted row.
- Cursor input MUST be treated as untrusted: validate decoding, version, field types, allowed direction and required keys before query construction.
- Page size MUST be server-bounded; values <= 0 or above the configured maximum MUST be rejected or clamped according to the API contract.
- Each successful next-page cursor MUST advance relative to the prior cursor.
- Tests MUST cover equal primary sort values, empty pages, final pages, invalid cursors and duplicate prevention.
- Evidence MUST distinguish static suspicion from runtime-confirmed defects.

## MUST NOT
- MUST NOT use offset pagination for a feed requiring consistency while rows may be inserted/deleted between requests unless the behavior is explicitly accepted.
- MUST NOT order only by a non-unique field such as timestamp, score or name.
- MUST NOT trust a client-supplied cursor as SQL/LINQ text.
- MUST NOT silently change public cursor format, sort semantics or default ordering.
- MUST NOT perform production data/schema/config changes without explicit approval.

## SHOULD
- Prefer opaque, versioned cursors and keyset/seek pagination for mutable high-volume feeds.
- Prefer immutable ordering keys; document snapshot semantics when stronger consistency is required.
- Keep cursor parsing separate from query construction and return actionable invalid-cursor errors without leaking internals.
