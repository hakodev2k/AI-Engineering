# Core Skills

## Skill 1 — MCP metadata trust preflight
**Purpose:** stop server-authored instructions/descriptions from silently acquiring host authority.
**Trigger:** server connect/reconnect, `initialize`, `server/discover`, `tools/list`, prompt/resource metadata refresh, cache hit, or server version change.
**Inputs:** raw metadata, server identity, endpoint, cache metadata, local policy, optional approved hash pin.
**Preconditions:** raw response is available before model-context assembly; server identity is resolved by the host, not inferred from server text.
**Required context:** trust policy, current connection identity, cache source, prior accepted digest if any.
**Tools:** `scripts/mcp_trust_guard.py`, immutable logs containing decisions/digests only.
**Procedure:** capture raw metadata → resolve origin → run deterministic gate → inspect decision → quarantine on violation → if accepted, pass only `safe_context` to the context builder → persist digest/decision → require independent verification for policy changes.
**Decisions:** accept-as-untrusted-data, quarantine, or human-review. Acceptance never means system-level trust.
**Constraints:** never concatenate raw server text into system/developer instructions; never let server-authored `cacheScope` alone authorize shared reuse.
**Expected output:** normalized safe context, digest, reasons/warnings, measurable decision.
**Metrics:** percent of metadata gated, quarantine count, hash-drift events, raw-to-safe byte ratio, public-cache denials.
**Verification:** test malicious/benign fixtures and inspect final context-channel placement.
**Failure handling:** fail closed if policy/input cannot be parsed; preserve raw response only in protected diagnostics when organizational policy permits.
**Stop conditions:** stop connection activation when identity is missing, metadata is quarantined, or drift requires approval.

## Skill 2 — Metadata drift approval
**Purpose:** detect a trusted server changing behavior-shaping metadata after initial approval.
**Trigger:** digest differs from a pinned approved digest.
**Inputs:** previous digest, new digest, normalized diff, server identity/version.
**Procedure:** do not auto-update pin → produce bounded diff → classify additions/removals in instructions/tool descriptions → require explicit approval for trust-policy change → update pin only through configuration review → rerun tests.
**Constraints:** implementation agent cannot approve its own new pin for production/high-risk servers.
**Metrics:** unreviewed drift accepted = 0; time-to-review; drift frequency per server.
**Verification:** configured pin matches deterministic SHA-256 from the current normalized metadata.
**Failure handling:** use last known-good metadata only if freshness policy explicitly allows it; otherwise disable affected server integration.
**Stop conditions:** unresolved drift after one review cycle or any unexpected executable/credential guidance.

## Skill 3 — Safe MCP cache admission
**Purpose:** prevent cross-authorization reuse of behavior-shaping MCP metadata.
**Trigger:** cache read/write for discovery, tools, prompts, resources, or instructions.
**Inputs:** cache scope, authorization partition, server identity, metadata digest, endpoint, local cache policy.
**Procedure:** classify content → deny shared cache for instruction-bearing metadata by default → key private cache by server identity + auth partition + endpoint + digest/version → verify freshness → rerun trust gate on cache read → emit cache provenance.
**Constraints:** cached content never bypasses validation; `public` is a server hint, not local authorization.
**Metrics:** cache hits by scope, rejected cross-partition hits, stale/digest mismatch count.
**Verification:** fixtures prove user/tenant A metadata cannot be served to B under default policy.
**Failure handling:** bypass cache and refetch; never widen scope to recover performance.
**Stop conditions:** unknown origin, missing partition, expired entry, or digest mismatch.
