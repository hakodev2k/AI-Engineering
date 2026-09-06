# Skill: MCP Cache Threat Assessment

## Purpose
Determine whether an MCP response can be cached safely and at what scope, using observable authorization and content properties rather than trusting a server-authored cache hint alone.

## Trigger
Run when adopting MCP 2026-07-28 caching, adding a shared gateway/CDN, enabling public cache reuse, changing authentication/tenant filtering, or investigating suspicious cache hits.

## Inputs
- Server identity and transport endpoint.
- MCP method and negotiated protocol version.
- Declared `ttlMs` and `cacheScope`.
- Authentication requirement.
- Whether response bytes can vary by principal, tenant, role, feature flag, locale, repository, workspace, or permission set.
- Whether the response contains model-visible instructions/tool/prompt/resource content.
- Effective cache-key fields and cache telemetry.

## Preconditions
Use synthetic/non-production identities for active verification unless an authorized security test explicitly permits production. Never collect raw credentials into the assessment artifact.

## Allowed tools
Protocol clients, gateway logs, configuration inspection, deterministic scripts in this package, synthetic test identities, and read-only cache inspection.

## Constraints
No destructive tool calls. No bypass of server authorization. No secret logging. Public-cache promotion requires independent review.

## Procedure
1. Record the server identity, method, protocol revision, and current declared cache metadata.
2. Classify the response as unauthenticated invariant, authenticated invariant, or authorization-dependent.
3. Compare responses from at least two synthetic authorization contexts when authentication exists. Canonicalize only transport-irrelevant fields; do not normalize away security-relevant differences.
4. Inspect whether model-visible instructions, tool descriptions, prompts, or resource payloads can be server-controlled or change independently of the approved server identity.
5. Inspect the effective cache key. For private entries verify it contains a non-secret authorization-context digest and all request fields that change the result.
6. Run `scripts/verify_cache_scope.py` against an assessment JSON document.
7. Form one of three decisions: `public-approved`, `private-only`, or `no-cache/quarantine`.
8. Have the Security Verifier independently replay the cross-context test before any public promotion.

## Decision points
- If any response varies by authorization context: private-only.
- If cache metadata is malformed/ambiguous: no-cache or private-only.
- If untrusted model-visible instructions are present: quarantine unless separately approved.
- If public invariance is demonstrated and no trust blocker exists: public can be considered, but requires independent approval.

## Expected output
A dated assessment containing observed facts, declared policy, effective key fields, cross-context comparison, decision, risks, and verification status.

## Metrics
Cross-context cache-hit count, number of public candidates, percentage with invariance evidence, malformed-metadata count, and mean stale-entry eviction time after policy change.

## Verification
A public candidate passes only when two or more distinct synthetic authorization contexts produce byte-equivalent security-relevant content and cache reuse is explicitly approved. A private candidate passes only when cross-context reuse is zero.

## Failure handling
Capture the smallest non-secret evidence needed, force private/no-cache mode, invalidate suspect entries, and escalate to the security owner.

## Stop conditions
Stop after one successful independent verification, or after two failed remediation attempts. A third attempt requires human review; never weaken isolation to make the test pass.
