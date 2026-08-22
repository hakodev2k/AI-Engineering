# Hooks

## Hook 1 — Pre-publish Manifest Gate
**Trigger:** immediately after the MCP client fetches `tools/list`, before tools are inserted into the model-visible registry.

**Action:** serialize stable server identity plus tool definitions to a temporary manifest and run:

`python scripts/manifest_guard.py check --manifest current.json --baseline approved.json --policy config/policy.json --report drift-report.json`

**Expected result:** exit 0 before current tools are published.

**Failure behavior:** exit 2 quarantines blocked changed/new tools; exit 3/4 fails closed for that server and emits a non-secret operational alert. Never auto-snapshot.

## Hook 2 — `tools/list_changed` Reconciliation
**Trigger:** MCP `tools/list_changed` notification.

**Action:** mark the server registry as `refresh-pending`, fetch a fresh manifest, execute Hook 1, then atomically publish only an approved/pass set.

**Expected result:** no time window in which changed tools are visible before comparison completes.

**Failure behavior:** retain last known approved registry if the host can prove it is still backed by the same active server/version and invocation authorization can enforce it; otherwise quarantine server tools. Do not merge partial live state.

## Hook 3 — Cache/TTL Refresh Gate
**Trigger:** list cache expiration or explicit runtime refetch.

**Action:** compare the newly fetched manifest before replacing cached approved tool definitions. Cache freshness does not bypass approval continuity.

**Expected result:** refreshed no-op manifest passes; material drift creates a review event.

**Failure behavior:** fail closed for newly fetched changes. A transport retry is bounded to two attempts.

## Hook 4 — Pre-invocation Digest Assertion
**Trigger:** immediately before dispatching any MCP tool call.

**Action:** ensure the invoked tool name exists in the active approved registry and that registry is associated with the currently approved baseline digest/server identity.

**Command/script:** host-specific assertion; optionally run `manifest_guard.py check` if the host lacks an in-memory attested registry and performance permits.

**Expected result:** invocation references an approved registry revision.

**Failure behavior:** reject invocation and request reconciliation. Never rely on a prompt-level warning.

## Hook 5 — Approval Finalization
**Trigger:** an independent reviewer approves the exact blocked manifest digest.

**Action:** Baseline Custodian runs `snapshot` with the approval id, preserves the prior baseline, then runs `check` again.

**Expected result:** new baseline digest equals reviewed current digest and round-trip check exits 0.

**Failure behavior:** keep changed tools quarantined; do not publish on partial success.

## Hook 6 — Final Verification
**Trigger:** deployment/update of this guard or MCP host integration.

**Action:** run `python tests/test_manifest_guard.py` and host-level negative tests for registry quarantine.

**Expected result:** deterministic unit tests pass and blocked fixtures never appear in the model-visible registry.

**Failure behavior:** deployment is not Verified; do not disable security checks to pass rollout.
