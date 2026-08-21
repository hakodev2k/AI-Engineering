# Workflows

## Workflow 1 — MCP metadata admission
**Trigger:** connect/reconnect, discovery refresh, tool-list refresh, prompt/resource metadata refresh, or cache read.
**Goal:** prevent server-authored metadata from silently becoming trusted LLM instructions.
**Inputs:** raw MCP metadata, server identity, endpoint, cache provenance, local policy.
**Baseline:** record current behavior: where raw metadata enters context, byte size, cache scope, whether a digest exists, and whether any raw server text reaches system/developer channels.
**Context:** host trust policy, auth/tenant partition, server connection config.

### Stages
1. **Observe** — Metadata Evidence Analyst identifies all behavior-shaping fields and their origin.
2. **Normalize** — Integration Agent serializes the supported subset and strips disallowed controls.
3. **Gate** — run `scripts/mcp_trust_guard.py`.
4. **Decision checkpoint** — `quarantine` stops context/cache admission; `accept_as_untrusted_data` continues only with `safe_context`.
5. **Context assembly** — place safe content in an untrusted-data section, never system/developer policy.
6. **Cache admission** — private/partitioned cache only unless explicit local exception exists.
7. **Measure** — record decision, digest, bytes, cache scope, warnings, and latency.
8. **Verify** — independent Verification Agent checks synthetic attack fixtures and actual channel placement.

**Responsible agents:** Evidence Analyst → Integration Agent → Security Reviewer → Verification Agent.
**Tools:** trust guard, diff/hash utilities, tests, context instrumentation.
**Outputs:** safe context or quarantine record; metadata digest; metrics.
**Checkpoints:** origin known; gate passes; cache scope allowed; channel placement verified.
**Metrics:** gated coverage, quarantine rate, drift rate, public-cache denials, p95 gate latency, raw/safe bytes.
**Retry policy:** one retry only for transient parse/transport corruption after refetch. Security-policy failures are not retried automatically.
**Stop conditions:** unknown required server identity, invalid policy, quarantine result, unresolved drift, failed context-placement test.
**Failure path:** disable affected MCP metadata path/server; retain last known-good pinned metadata only when freshness policy explicitly permits it; escalate for review.
**Verification:** malicious server text cannot change host policy; public cache fixture is denied; benign private metadata remains usable as untrusted data.
**Definition of Done:** all tests pass, no raw server text in trusted channels, metrics emitted, and no unresolved quarantine.

## Workflow 2 — Metadata drift response
**Trigger:** current SHA-256 differs from configured approved digest.
**Goal:** prevent silent behavioral change from a previously approved server.
**Inputs:** prior/new digest, normalized metadata, server version/identity.
**Baseline:** prior accepted metadata and decision.
**Stages:** freeze reuse → generate bounded normalized diff → Evidence Analyst classifies change → Security Reviewer determines risk → run malicious/benign regression suite → human approval when high-risk → update pin through reviewed config → rerun admission workflow.
**Checkpoint:** no pin update before review.
**Metrics:** drift events/server/month, percent approved/rejected, review latency.
**Retry policy:** no automatic approval retries; one refetch allowed to rule out transient inconsistent discovery.
**Stop conditions:** unexplained drift, new executable/secret/override guidance, failed tests.
**Failure path:** remain on last known-good metadata if allowed or disable server integration.
**Verification:** new pin equals deterministic digest and policy diff is recorded.
**Definition of Done:** drift explained, approved by required reviewer, tests pass, new digest pinned, cache invalidated.

## Workflow 3 — Security regression loop
**Trigger:** guard/policy/client integration changes.
**Goal:** prevent a false sense of safety from implementation drift.
**Inputs:** code/config changes and synthetic fixtures.
**Stages:** baseline current tests → run benign fixture → injection fixture → public-cache fixture → oversize fixture → hash-drift fixture → inspect final context serialization → compare metrics.
**Retry policy:** maximum two implementation iterations. After two failures, stop and escalate rather than weakening rules.
**Verification:** all expected exit codes/decisions match; system/developer policy remains byte-for-byte independent of server-authored instructions.
**Definition of Done:** regression suite green, independent verifier signs off, no policy threshold was relaxed without separate review.
