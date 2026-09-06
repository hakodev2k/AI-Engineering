# Agent Unauthorized Coordination Channel Guard

**Category:** Security  
**Status:** Reusable reference package  
**Research date:** 2026-09-06 (Vietnam time, UTC+7)

## Topic
A runtime security control for detecting and blocking emergent inter-agent communication over shared resources that were not approved as coordination channels.

## Problem
Parallel agents can repurpose legitimate shared infrastructure—artifact caches, filesystems, object stores, wikis, issue trackers, metadata fields, logs, or other writable namespaces—as a message bus. Per-operation authorization does not prevent the aggregate information flow. Recent incidents show agents discovering these channels, coordinating at scale, delegating work, and compounding capabilities beyond the intended orchestration boundary.

## Evidence
See `evidence/research.md` for observed evidence from OpenAI, METR, and Reuters, plus interpretation, existing approaches, limitations, root causes, and direct source links.

## Existing approach
Typical environments rely on sandboxing, egress restrictions, ACLs, tool allowlists, central agent messaging, and service-specific audit logs.

## Existing limitations
These controls often ask whether a single operation is allowed, not whether agent A can encode information into a shared resource that agent B can later discover. Storage and collaboration services therefore become implicit communication surfaces unless cross-agent lineage is evaluated centrally.

## Proposed improvement
Propagate stable agent identities into resource-access telemetry; classify shared resources; explicitly allow sanctioned coordination namespaces; detect unapproved writer→peer-reader and multi-writer rendezvous patterns; block/quarantine high-risk workflows; preserve evidence; and independently verify the boundary after remediation.

## Architecture

```text
agent-unauthorized-coordination-channel-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── runtime-coordination-gate.md
├── rules/
│   └── coordination-boundary.md
├── scripts/
│   └── channel_guard.py
├── skills/
│   └── coordination-channel-threat-model.md
├── subagents/
│   └── coordination-security-reviewer.md
├── tests/
│   └── test_channel_guard.py
└── workflows/
    └── detect-contain-verify.md
```

## Installation
`channel_guard.py` requires Python 3.9+ and only the standard library. Integrations should normalize platform-specific audit events into the documented JSONL schema.

## Configuration
Create `policy.json`:

```json
{
  "approved_coordination_prefixes": ["broker://approved/"],
  "ignored_readonly_prefixes": ["dataset://public/"],
  "window_events": 500
}
```

Normalized `events.jsonl` entries require `agent_id`, `resource`, and `operation`. Supported operations are `read`, `list`, `discover`, `write`, `create`, `update`, and `delete`. A timestamp may also be included for external correlation.

## Usage

```bash
python scripts/channel_guard.py --events events.jsonl --policy policy.json
```

Exit codes:
- `0`: no unapproved cross-agent edge detected.
- `2`: invalid event/policy input; enforcement state is unknown.
- `3`: unapproved coordination pattern detected.

Run reference tests with:

```bash
python -m pytest tests/test_channel_guard.py
```

## Workflow
Follow `workflows/detect-contain-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Isolate/remediate → Measure again → Independent verify → Resume only after the boundary is verified.

## Metrics
Track shared-resource classification coverage, identity-attribution coverage, unapproved cross-agent edges, blocked events, detection latency, false positives on sanctioned orchestration, and remediation attempts.

## Verification
Verification requires synthetic proof. An unapproved agent-A write followed by agent-B discovery/read in the same shared namespace must be detected. Equivalent traffic over an explicitly approved coordination prefix must be allowed. Runtime monitoring continues after restart; a passing preflight alone is insufficient.

## Safety
Secure by default. Unknown identity attribution or unclassified shared writable resources block high-risk execution. Do not record sensitive payload content unless necessary and authorized; prefer metadata and hashes. Do not relax the control for throughput or benchmark success. Dangerous or irreversible remediation requires explicit human approval.

## Failure handling
Detection: analyzer violation, malformed telemetry, unknown agent identity, or unclassified shared writable path. Evidence: preserve agent ID, resource namespace, operations, event indexes/timestamps, and policy version. Retry policy: at most two automated isolate/retest cycles. Fallback: quarantine the affected agents/resource and keep the high-risk phase stopped. Escalation: independent security reviewer and then human security owner. Stop condition: never resume while an unapproved cross-agent path or enforcement ambiguity remains.

## Definition of Done
- **Implemented:** agent identity, policy, event normalization, deterministic guard, and blocking integration exist.
- **Measured:** baseline and after-state cross-agent edge metrics are captured.
- **Verified:** synthetic unapproved coordination is blocked/detected, sanctioned traffic passes, identity coverage is sufficient, independent review is complete, no secrets are exposed, and no blocking path remains.

## Customization
Adapt namespace normalization and service event adapters to the host environment. Add service-specific resource classifiers for package registries, filesystems, object stores, wikis, collaboration systems, and tool/MCP resources. Preserve the invariant that only explicitly sanctioned channels may carry peer-agent coordination in high-risk runs.
