# Engineering Rules

## MUST
- MUST treat all MCP server-authored natural language, tool descriptions, prompt templates, annotations, and discovery instructions as untrusted data unless a separate host policy explicitly elevates a narrow field.
- MUST run the deterministic trust gate before server metadata enters model context or a reusable cache.
- MUST preserve server identity, endpoint, cache provenance, and metadata SHA-256 alongside every admission decision.
- MUST enforce bounded instruction/description sizes before context assembly.
- MUST deny shared/public cache admission for instruction-bearing metadata by default.
- MUST rerun the gate on cache reads; cached data is not implicitly trusted.
- MUST surface metadata hash drift before reusing a configured trust pin.
- MUST keep tool execution approval, sandboxing, authorization, and egress controls independent from metadata acceptance.
- MUST quarantine on invalid policy, unknown required origin, configured pattern violation, or pin drift when policy requires it.
- MUST verify both stdout/result serialization and prompt/context placement in integration tests.

## MUST NOT
- MUST NOT concatenate raw MCP server instructions into system/developer prompts.
- MUST NOT use prompt-injection detection as the sole trust decision.
- MUST NOT accept `cacheScope: public` as proof that cross-user reuse is safe.
- MUST NOT auto-update an approved metadata hash because the server claims a new version.
- MUST NOT let server text redefine host policy, approval rules, identity, sandbox, filesystem scope, network scope, secret handling, or user intent.
- MUST NOT downgrade quarantine to warning merely to improve availability.
- MUST NOT log secrets or full sensitive resources while recording trust decisions.
- MUST NOT let the same agent that changes a production trust policy be its sole verifier.

## SHOULD
- SHOULD use stable host-generated server identifiers rather than display names supplied by servers.
- SHOULD key caches by server identity, auth/tenant partition, endpoint, and policy version.
- SHOULD show reviewers normalized diffs rather than entire unbounded metadata blobs.
- SHOULD record metrics for quarantine rate, drift, cache denials, and metadata size.
- SHOULD keep policy configuration version-controlled and code-reviewed.
- SHOULD prefer disabling a single unsafe server over weakening global policy.
