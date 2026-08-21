# Pagination Investigation Skill

## Purpose
Determine whether an API client can prove it retrieved a complete collection rather than merely receiving successful pages.

## When to use
Use for API integrations, synchronization jobs, export tools, crawlers, SDK wrappers, or agents that may silently stop early, repeat pages, or miss records.

## Inputs
Endpoint, authentication method, pagination mode, item identity field, page/cursor metadata, expected ordering, and relevant logs/tests.

## Preconditions
Read-only API access must be sufficient. Secrets must be supplied through the host environment, not committed files.

## Allowed tools
Repository search, HTTP client, test runner, logs, official API documentation, and `scripts/pagination_gate.py`.

## Constraints
Do not mutate remote data. Do not infer completeness from HTTP 200 alone. Do not accept a repeated cursor, repeated target, or unexplained item-count drop as complete.

## Procedure
1. Locate the integration entry point and identify how it obtains the next page.
2. Identify the termination condition and the stable item identity field.
3. Confirm the documented pagination contract: Link header, cursor, page number, or offset.
4. Inspect retry/error handling for every page, not only the first request.
5. Run `scripts/pagination_gate.py` against a safe endpoint or fixture.
6. Record pages fetched, items seen, unique items, duplicate count, loop count, errors, and terminal evidence.
7. Compare runtime behavior with the implementation. Mark every discrepancy as fact or hypothesis.
8. If completeness cannot be proven, return `partial` or `blocked`; never claim success.

## Expected output
A result matching `schemas/pagination-result.schema.json` plus evidence identifying the termination rule and any failure mode.

## Verification
Completeness is verified only when the run reaches a legitimate terminal condition with no unresolved page failure or loop.

## Failure handling
Retry transient 429/5xx/network failures at most two times per page. Preserve the failed target and error. Stop on repeated targets, invalid response shape, authentication failure, or configured safety caps.

## Stop conditions
Stop after verified completion, a blocking error, a detected pagination loop, `max_pages`, or `max_items`.
