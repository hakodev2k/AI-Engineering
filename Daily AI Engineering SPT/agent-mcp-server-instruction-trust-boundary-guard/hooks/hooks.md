# Hooks

## Hook 1 — Pre-context MCP metadata gate
**Trigger:** immediately after MCP discovery/tool metadata is received and before any model prompt/context is assembled.
**Action:** serialize supported metadata to a temporary JSON object and run:
`python3 scripts/mcp_trust_guard.py --input <metadata.json> --policy config/policy.json --output <decision.json>`
**Expected result:** exit 0 with `accept_as_untrusted_data`; only `safe_context` may proceed.
**Failure behavior:** exit 2 quarantines the metadata/server path; exit 3/4 fails closed and alerts integration owner. Never pass raw metadata through as fallback.

## Hook 2 — Cache read revalidation
**Trigger:** MCP discovery/tool metadata is read from any cache.
**Action:** attach cache provenance and rerun the same trust gate before reuse.
**Expected result:** digest/policy still valid and scope is permitted.
**Failure behavior:** evict/bypass the entry and refetch; never widen cache scope.

## Hook 3 — Hash drift checkpoint
**Trigger:** normalized metadata digest differs from the configured pin for a trusted server.
**Action:** block reuse, generate a normalized diff, route to Security Reviewer.
**Expected result:** explicit reviewed pin update or rejection.
**Failure behavior:** keep server disabled or use last known-good data only when freshness policy allows it.

## Hook 4 — Pre-release regression
**Trigger:** changes to guard, policy, MCP client adapter, cache layer, or prompt/context builder.
**Action:** run `python3 tests/test_guard.py` and inspect final context-channel placement using synthetic fixtures.
**Expected result:** benign fixture accepted as untrusted data; injection/public-cache/oversize/drift fixtures quarantined as configured.
**Failure behavior:** block release. Maximum two fix-and-retest loops before escalation.

## Hook 5 — Final verification
**Trigger:** before marking package/integration verified.
**Action:** confirm: raw MCP instruction text is absent from trusted instruction channels; every accepted metadata object has provenance+digest; quarantine records contain reasons; no secrets/full sensitive resources are emitted by diagnostics.
**Expected result:** Implemented + Measured + Verified statuses all satisfied.
**Failure behavior:** status remains incomplete; do not claim the security boundary is verified.
