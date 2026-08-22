# Skill: Capture Tool Result Freshness

## Purpose
Bind every decision-relevant tool result to enough metadata to determine later whether it is still safe to use.

## When to use
Use after any repository query, database read, log search, API lookup, deployment/status query, issue/PR lookup, permission check, configuration read, runtime inspection, or external service response that may become stale before the workflow finishes.

## Inputs
- Tool name and logical source identity.
- Query/arguments after secret redaction.
- Result artifact path or result hash.
- Observation timestamp in UTC.
- Source revision/version/etag/commit/resource-version when available.
- Decision(s) that may depend on the result.
- Known invalidation events.

## Preconditions
- The result was actually observed.
- Sensitive values can be excluded or fingerprinted.
- The source identity can be described without embedding secrets.

## Allowed tools
Read-only repository, filesystem, API, database, log, monitoring, CI/CD and metadata tools. Writing the freshness record itself is allowed.

## Constraints
- Do not store raw secrets, tokens, passwords, connection strings or full sensitive payloads.
- Do not invent source versions that the provider did not return.
- Use `unknown` for unavailable version signals and compensate with shorter TTL or event-based invalidation.
- Observation time must describe when the source was read, not when the record was later written.

## Procedure
1. Assign a stable `result_id` scoped to the workflow run.
2. Record `source.kind`, `source.identity` and tool name.
3. Canonicalize non-sensitive query inputs and compute SHA-256 `query_fingerprint`.
4. Hash the normalized decision-relevant result into `result_fingerprint`; if the result is too large, hash an artifact and record its path.
5. Record `observed_at` and any source revision, etag, commit, deployment id, resource version or checkpoint.
6. Classify volatility as `low`, `medium`, `high` or `event-driven`.
7. Bind a freshness policy from `config/freshness-policy.json`.
8. Record invalidation signals relevant to the source, such as repository HEAD change, deployment completion, database write, config update, approval/revocation, incident state change or external mutation.
9. Record the downstream decisions that consume this result.
10. Validate the record with `scripts/validate-freshness-record.py`.

## Expected output
A valid JSON record conforming to `schemas/freshness-record.schema.json`.

## Verification
- Query/result fingerprints are non-empty SHA-256 values.
- Observation timestamp is parseable and not in the future beyond allowed clock skew.
- Policy id exists.
- Invalidation signals are explicit for mutable sources.
- Raw sensitive values are absent.

## Failure handling
- Missing source version: retain `unknown`, lower freshness duration, require event checks before reuse.
- Tool output unavailable: mark result unusable; do not create synthetic evidence.
- Validation failure: fix the record once; if still invalid, block reuse.

## Stop conditions
Stop and request fresh evidence if the result cannot be bound to a recognizable source or if safe freshness cannot be established.