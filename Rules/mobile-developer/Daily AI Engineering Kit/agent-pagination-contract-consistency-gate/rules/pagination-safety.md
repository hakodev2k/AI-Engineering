# Pagination Safety Rules

## MUST
- Use deterministic ordering for every paginated query.
- Include a unique deterministic tiebreaker when the primary sort key is not unique.
- Bound page size with both a default and hard maximum.
- Document whether the consistency contract tolerates inserts/deletes between page requests.
- Verify duplicate/gap behavior using observable item identities.
- Preserve public parameter and response semantics unless an approved breaking change is required.
- Require approval for breaking API contracts, schema changes, production configuration/deployment, or destructive data operations.
- Record unresolved pagination risks in the final assessment.

## MUST NOT
- Paginate an unordered database result.
- Claim mutation-stable offset pagination without evidence.
- Trust client-supplied page size without a server-side cap.
- Encode secrets, credentials, or unnecessary sensitive state in continuation tokens.
- Treat Base64 encoding as encryption.
- Change ordering defaults silently when clients can observe the difference.
- Hide gaps/duplicates by weakening assertions or comparing only item counts.

## SHOULD
- Prefer keyset/cursor pagination for large, frequently changing ordered datasets when contract requirements allow it.
- Keep continuation tokens opaque and versionable.
- Test duplicate sort values, null sort values when allowed, and ascending/descending boundaries.
- Measure generated SQL/query plans when pagination is performance-sensitive.
- Keep fixes scoped to the pagination boundary and relevant tests.
