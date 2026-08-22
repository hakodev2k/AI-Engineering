# Skill: Capability Contract Analysis

## Purpose
Determine whether a configured model provider can safely execute the exact agent feature set before expensive work begins.

## Trigger
Provider/model change, client upgrade, first Guardian/review invocation, new tool family, or cached capability record expiry.

## Inputs
Provider endpoint identity, API version, model, client version, requested features, effective serialized request schema, known provider documentation/probe results.

## Preconditions
A non-destructive test request can be generated without credentials being logged.

## Required context
Primary-turn tool set, Guardian/reviewer tool set, Responses Lite flag, namespace/additional-tools usage, MCP/tool-search/collaboration requirements.

## Allowed tools
Request serializer, schema inspector, HTTP test client, local trace redactor, capability cache.

## Constraints
Never send destructive tools during probing. Never assume `wire_api=responses` implies proprietary-extension support. Never log authorization headers or secrets.

## Procedure
1. Build the required feature contract for each request lane: primary, review, collaboration, deferred tool search.
2. Normalize requested wire features into named capabilities.
3. Load cached results only when endpoint, model, API version, and client serializer version all match.
4. Generate minimal non-destructive probes for unknown capabilities.
5. Classify responses: supported, unsupported-deterministic, transient, authentication, unknown.
6. For deterministic unsupported features, compute the smallest safe downgrade that preserves required behavior.
7. If required behavior cannot be preserved, block before the task enters execution.
8. Emit a capability matrix and selected profile.

## Decision points
- HTTP/schema 4xx tied to a specific field => deterministic unsupported; no retry loop.
- 429/5xx/network timeout => transient; at most two retries with backoff.
- Review capability unsupported while approval is required => BLOCK, never bypass review.
- Optional feature unsupported => disable only if correctness/security semantics remain equivalent.

## Expected output
Machine-readable capability matrix with `required`, `supported`, `evidence`, `fallback`, and `blocking` fields.

## Metrics
Pre-inference failure rate, deterministic retries avoided, preflight latency, cache hit rate, task startup latency, successful review-turn rate.

## Verification
Run one primary and one review-lane canary when those lanes are required; assert no undeclared wire extension appears in the serialized request.

## Failure handling
Two transient retries maximum. Deterministic incompatibility triggers safe-profile selection or BLOCK.

## Stop conditions
Stop on authentication uncertainty, destructive-only validation path, unresolved required capability, or security-semantic downgrade.