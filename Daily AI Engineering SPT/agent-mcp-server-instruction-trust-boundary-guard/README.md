# Agent MCP Server Instruction Trust-Boundary Guard

## Topic
A reusable security control that prevents MCP server-authored instructions, tool descriptions, prompt metadata, and cached discovery data from silently acquiring host-level authority inside AI-agent context.

## Category
**Security**

## Problem
Modern MCP clients discover server metadata and often use natural-language descriptions to help the model understand available capabilities. Recent MCP 2026-07-28 issue reports show two related risks: server-controlled `instructions` can become a prompt-injection surface, and server-authored `cacheScope: public` can allow poisoned discovery/tool/prompt/resource metadata to cross authorization contexts through shared caches.

The dangerous failure is not merely “a suspicious phrase appears.” It is architectural: server-authored text can be promoted into a trusted prompt channel without a durable provenance boundary.

## Evidence
The research is documented in [`evidence/research.md`](evidence/research.md).

Key current signals:
- MCP issue #3213 (opened 2026-08-07): `server/discover` / `initialize` instructions prompt-injection path.
- MCP issue #3207 (opened 2026-08-06): cross-user cache poisoning through `cacheScope: public`.
- MCP issue #3180 (opened 2026-07-31): tool-description and prompt-template injection in a broader protocol security review.
- MCP 2026-07-28 tools specification already requires clients to treat tool annotations as untrusted unless the server is trusted, establishing a trust-boundary precedent.

## Existing approach
Common integrations either inject server usage guidance into model context directly, rely on server allowlists, use keyword prompt-injection detection, or optimize discovery through caching.

## Existing limitations
- Direct injection collapses server data and host policy into one authority surface.
- Keyword detection is bypassable and cannot prove benign intent.
- Server allowlists do not detect compromise or behavior-changing metadata drift.
- Shared caching can erase authorization/origin boundaries if cache metadata is trusted as a security decision.
- Authentication proves endpoint identity, not that every server-authored instruction deserves system-level authority.

## Proposed improvement
Introduce a client-side **metadata trust gate** before context assembly and cache admission. The package:
1. resolves a host-owned server identity;
2. normalizes server-authored behavior-shaping metadata;
3. enforces deterministic length/control-character policy;
4. detects suspicious patterns for quarantine/escalation;
5. labels accepted content as `untrusted_server_content`;
6. denies public/shared cache reuse for instruction-bearing metadata by default;
7. computes a SHA-256 digest for drift detection/pinning;
8. keeps approval, sandbox, authorization, egress, and secret controls independent;
9. verifies the final model request does not place raw server text in system/developer channels.

Prompt-injection detection is intentionally secondary. **Origin preservation and channel separation are the primary security boundary.**

## Architecture

```text
MCP server
   |
   v
Transport / auth
   |
   v
Host-owned server identity
   |
   v
Raw discovery / tool metadata
   |
   v
mcp_trust_guard.py ---- policy.json
   |                         |
   | accept                  | quarantine
   v                         v
safe_context            blocked/review
(untrusted data)
   |
   +--> private partitioned cache (optional; revalidate on read)
   |
   v
Model context builder
   |
   +--> host/system/developer policy stays separate
   +--> server metadata is rendered only as untrusted data
```

## Package structure

```text
agent-mcp-server-instruction-trust-boundary-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── mcp_trust_guard.py
└── tests/
    └── test_guard.py
```

## Installation
Requires Python 3.10+ and only the standard library.

Clone/copy this directory into the integration repository, then run:

```bash
python3 tests/test_guard.py
```

No external package installation is required.

## Configuration
Edit [`config/policy.json`](config/policy.json).

Important controls:
- `max_instruction_chars`: maximum accepted server instruction length before quarantine/truncation.
- `max_description_chars`: maximum tool-description length.
- `deny_public_cache_for_instructional_metadata`: secure default preventing shared cache reuse.
- `high_risk_patterns`: deterministic escalation signals; not the trust boundary by themselves.
- `trusted_servers`: optional local hash pins keyed by host-owned server identity.
- `quarantine_on_hash_drift`: stop silent behavioral change after approval.

Do not place secrets in this file.

## Usage
Prepare a bounded input JSON:

```json
{
  "server_id": "example/search@corp",
  "endpoint": "server/discover",
  "cacheScope": "private",
  "ttlMs": 60000,
  "instructions": "Use search for project documentation.",
  "tools": [
    {"name": "search", "description": "Search indexed documentation."}
  ]
}
```

Run:

```bash
python3 scripts/mcp_trust_guard.py \
  --input metadata.json \
  --policy config/policy.json \
  --output decision.json
```

Exit codes:
- `0`: accepted **as untrusted data**;
- `2`: quarantined by security policy;
- `3`: invalid input/policy;
- `4`: I/O/runtime failure.

Only `decision.json.safe_context` may proceed to model-context assembly. Raw server instructions must not be substituted as a fallback.

## Workflow
The detailed procedures are in [`workflows/workflows.md`](workflows/workflows.md).

Primary path:

**Observe → Resolve origin → Normalize → Gate → Quarantine or safe-context admission → Cache policy → Context-channel separation → Measure → Independent verification.**

Hash drift uses a separate bounded flow:

**Freeze reuse → Diff → Evidence review → Security review → Test → Approve/reject pin → Revalidate.**

Every loop is bounded; security failures do not retry indefinitely.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) defines three executable skills:
- MCP metadata trust preflight;
- metadata drift approval;
- safe MCP cache admission.

Each includes trigger, inputs, constraints, measurable output, verification, failure handling, and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines observable **MUST / MUST NOT / SHOULD** controls.

Critical invariant: server-authored text never becomes host/system/developer policy merely because the server is connected, authenticated, cached, or allowlisted.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) separates responsibilities among:
- Metadata Evidence Analyst;
- Security Reviewer;
- Integration Agent;
- Verification Agent.

High-risk trust-policy changes cannot be implemented and solely verified by the same agent.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) specifies:
- pre-context metadata gate;
- cache-read revalidation;
- hash-drift checkpoint;
- pre-release regression;
- final verification.

## Metrics
Recommended metrics:
- `metadata_gate_coverage_pct` — percent of MCP behavior-shaping metadata passing through the guard (target: 100%).
- `quarantine_count` and reason distribution.
- `metadata_hash_drift_count`.
- `public_cache_denial_count`.
- `raw_metadata_bytes` / `safe_context_bytes`.
- `gate_latency_ms` p50/p95.
- `trusted_channel_raw_server_occurrences` (target: 0).
- `unreviewed_pin_update_count` (target: 0).
- `cross_partition_cache_reuse_count` for behavior-shaping metadata (target: 0 under default policy).

## Verification
Run deterministic tests:

```bash
python3 tests/test_guard.py
```

The supplied fixtures verify:
- benign private metadata is accepted as explicitly untrusted data;
- prompt-injection-shaped instructions are quarantined;
- public-cache instructional metadata is denied;
- oversize instructions are bounded and quarantined.

A production integration must additionally inspect its **actual serialized model request** and prove that raw MCP server metadata is absent from system/developer channels. This host-specific check cannot be inferred from the standalone script.

### Implemented
- deterministic metadata gate;
- policy configuration;
- provenance/digest output;
- public-cache denial default;
- bounded pattern/size checks;
- runnable regression tests;
- skills/rules/subagents/workflows/hooks.

### Measured
The guard emits deterministic decision/reason/digest data from which gate coverage, drift, cache denials, size, and latency can be measured by the host.

### Verified
The package itself is verified when its regression tests pass. An integration is verified only after a separate host-specific context-placement test confirms the channel boundary.

## Safety
- The script does not execute MCP tools.
- It does not contact servers or providers.
- It does not mutate external state.
- It does not weaken tool approvals or sandboxing.
- It uses secure fail-closed behavior for invalid policy/input.
- Pattern detection is never used to promote content into a trusted instruction channel.
- Availability/performance recovery must not bypass provenance, cache partitioning, or quarantine.

## Failure handling
| Failure | Detection | Retry | Fallback | Stop condition |
|---|---|---:|---|---|
| malformed metadata | exit 3 | 1 refetch if transport corruption suspected | none | second failure |
| policy parse/config failure | exit 3/4 | 0 automatic policy retries | disable guarded path | valid reviewed policy required |
| suspicious instruction | exit 2 | 0 | quarantine/review | reviewer decision |
| public-cache instructional metadata | exit 2 | 0 | private/refetched path | permitted cache path exists |
| hash drift | digest mismatch | 1 refetch | last known-good only if freshness policy allows | reviewed pin or server disabled |
| regression failure | test failure | max 2 implementation iterations | none | escalate after second failure |

Never hide a failure by moving raw metadata into a trusted channel.

## Definition of Done
A deployment is complete only when all are true:
- evidence and current limitations documented;
- every behavior-shaping MCP metadata path is inventoried;
- host-owned server identity is available;
- deterministic gate runs before context/cache admission;
- raw server text is absent from system/developer channels;
- public shared cache is denied by default for instructional metadata;
- digest/drift telemetry exists;
- malicious, public-cache, oversize, and benign tests pass;
- cache-read revalidation is implemented when caching is used;
- no secret/full sensitive resource is written to trust logs;
- high-risk pin changes require independent review;
- metrics collected and compared to the baseline;
- no blocking quarantine or failed verification remains.

## Customization
- Add server-specific pattern signals only as escalation aids.
- Tune size budgets using observed benign metadata, preserving hard bounds.
- Add adapters for concrete MCP client event shapes while keeping the guard input small and stable.
- Add tenant/auth partition keys to cache implementations.
- Extend fixtures with organization-specific attacks and benign metadata.
- Integrate the decision format into SIEM/observability systems using reason codes and hashes rather than raw sensitive payloads.

For implementation details, follow [`guide-intergration.md`](guide-intergration.md).
