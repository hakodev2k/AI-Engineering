# Tool Result Freshness Governance

## MUST
- Record freshness metadata for every decision-relevant mutable tool result.
- Bind each result to source identity, query fingerprint, result fingerprint and observation time.
- Treat a result as stale when its TTL expires, its source revision changes, a configured invalidation event occurs, or its query inputs no longer match the current decision.
- Revalidate stale evidence before it is used for code changes, production decisions, approvals, deployment, destructive actions or final verification.
- Preserve superseded freshness records as evidence.
- Reconsider downstream conclusions when refreshed evidence changes.
- Require independent freshness review for high-risk decisions.
- Use UTC timestamps in machine-readable records.
- Stop before dangerous actions unless required human approvals are current and independently fresh.

## MUST NOT
- Treat a successful tool call from earlier in the run as permanently valid.
- Infer freshness from a path, identifier or resource still existing.
- Reuse a result whose source identity or query fingerprint differs from the current decision context.
- Blindly retry mutable reads until one produces the desired value.
- Overwrite old evidence to hide staleness.
- Store raw secrets or credentials in freshness records.
- Mark `executed` as `verified` solely because the original result was fresh at execution time.
- Increase tool permissions to refresh evidence without explicit authorization.
- Continue with a high-risk action when freshness is `unknown`.

## SHOULD
- Prefer provider revision IDs, etags, commit SHAs, deployment IDs or resource versions over time-only TTLs.
- Use shorter TTLs for volatile operational data.
- Refresh only invalidated evidence rather than reloading unrelated context.
- Keep invalidation rules deterministic and repository-configurable.
- Record why a result became stale and which decisions were affected.
- Use read-only tools for freshness checks whenever possible.