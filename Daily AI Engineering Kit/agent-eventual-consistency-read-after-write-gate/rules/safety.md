# Safety and Evidence Rules

## MUST
- Preserve the original write response, correlation ID, entity ID, timestamp, and version/ETag when available.
- Verify through the same read contract whose consistency matters to users or downstream systems.
- Bound automated verification to at most 4 attempts unless policy is deliberately changed by a human.
- Record every observation, including stale, missing, conflict, and throttled responses.
- Treat `verified` and `executed` as different states.
- Require explicit human approval before production writes, destructive compensation, consistency-model changes, cache flushes affecting shared production data, or infrastructure/routing changes.
- Use read-only credentials for verification whenever possible.

## MUST NOT
- Retry the original mutation to make a read-after-write test pass.
- Convert an eventual-consistency symptom into a destructive delete/recreate sequence.
- Claim a lost event, cache bug, or replica lag without evidence from that boundary.
- Increase permissions or obtain broader production access to unblock the agent.
- Hide retry attempts or report success when the final output is `unverified`.
- Compare versions lexically when the application defines a different version ordering; configure an application-specific verifier instead.
- Disable durability, security, authorization, or integrity controls to reduce propagation time.

## SHOULD
- Prefer monotonic versions, ETags, sequence numbers, or operation IDs over timing-only assertions.
- Prefer targeted cache keys and projections over global cache flushes.
- Keep the consistency window aligned with the documented service contract/SLO.
- Add regression tests around the specific async boundary after a root cause is confirmed.
