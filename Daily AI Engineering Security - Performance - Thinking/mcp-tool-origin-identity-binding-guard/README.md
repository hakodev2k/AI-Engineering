# MCP Tool Origin Identity Binding Guard

## Topic
Origin-aware identity binding for MCP tools aggregated across multiple servers, transports, sessions, and subagents.

## Category
Security

## Problem
An MCP tool's visible name is not a globally unique security principal. MCP hosts frequently aggregate tools from several servers or sessions, while approval, policy, caching, audit, and routing layers may use different naming/normalization rules. If these layers identify a capability by display name, server-reported name, array position, or an ambiguous concatenated string, the host can resolve policy for one logical tool and dispatch another origin.

The MCP 2026-07-28 specification explicitly limits tool-name uniqueness to one server and states that `serverInfo.name` is not guaranteed unique. Real 2026 implementation reports also describe duplicate-name failures and calls routed to the wrong MCP server process/session.

## Evidence
See [`evidence/research.md`](evidence/research.md).

Key current signals include:
- MCP 2026-07-28 tools specification: cross-server name collisions are possible and server names are not globally unique.
- MCP issue #1395: normalization/namespace ambiguity can cause logical overriding and interoperability/security problems.
- Claude Code issue #28093: concurrent sessions were reported routing an MCP call to the wrong server process/project.
- MCP issue #3180: security review identifies tool-name shadowing as a protocol-level design gap.

## Existing approach
Common approaches include prefixing the tool name with a server label, framework-generated names such as `mcp__server__tool`, maintaining a per-connection registry, rejecting duplicate names, or using the configured server name as part of a policy key.

## Existing limitations
These approaches improve presentation but can still fail as authorization boundaries because:
- server-reported names are not guaranteed unique,
- host labels can be reused,
- concatenated names can become ambiguous after normalization,
- a reconnect can replace process/session ownership without changing the visible name,
- schema changes may retain the same display name,
- approval and dispatch layers may re-resolve strings independently,
- picking the first duplicate or using fuzzy fallback hides ambiguity rather than proving identity.

## Proposed improvement
Create a host-controlled canonical identity for every live MCP tool and carry it through the complete lifecycle:

```text
trusted server configuration
        +
connection generation
        +
exact protocol tool name
        +
input-schema digest
        ↓
origin fingerprint
        ↓
canonical tool ID
        ↓
registry → resolver → approval/policy → pre-dispatch check → dispatcher → audit
```

The default canonical tuple is:

```text
server_instance_id
origin_fingerprint
connection_generation
tool_name
schema_digest
```

`display_alias` is deliberately outside the authorization identity. It exists for humans and model-facing tool selection only.

## Architecture

### Trust boundary
**Host-trusted inputs**
- configured server instance ID,
- configured stdio command/args/cwd or remote endpoint,
- host-managed connection generation,
- registry lifecycle and concrete connection handle.

**Server-provided/untrusted-for-identity metadata**
- `serverInfo.name`,
- tool descriptions,
- annotations,
- icons,
- presentation labels.

The exact protocol `tool_name` and `inputSchema` participate in identity only after being associated with a host-trusted live server instance.

### Registration path
1. Host assigns an immutable server instance ID.
2. Connection manager advances a generation for each new concrete process/session.
3. Tool discovery returns name/schema metadata.
4. `tool_identity_guard.py` derives schema digest, origin fingerprint, and canonical ID.
5. `audit_tool_catalog.py` checks the entire candidate catalog.
6. Only a validated snapshot is exposed to the model.

### Invocation path
1. Model-facing alias resolves to exactly one canonical ID.
2. Policy/approval decision is stored against that ID.
3. Immediately before transport dispatch, the host reloads the live identity.
4. The guard compares canonical ID, origin fingerprint, generation, schema digest, and exact tool name.
5. Dispatch proceeds only on exact match.
6. Audit records join the decision and actual dispatcher identity.

## Package structure

```text
mcp-tool-origin-identity-binding-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── identity-policy.json
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
│   ├── tool_identity_guard.py
│   └── audit_tool_catalog.py
├── tests/
│   └── test_tool_identity_guard.py
└── verification/
    └── verification-report.md
```

## Installation
Requires Python 3.10+ and only the Python standard library.

From the package root:

```bash
python scripts/tool_identity_guard.py --help
python scripts/audit_tool_catalog.py --help
python -m unittest discover -s tests -v
```

No external package install is required.

## Configuration
Default policy is in [`config/identity-policy.json`](config/identity-policy.json).

Important defaults:
- SHA-256 identity hashing,
- schema digest included,
- connection generation included,
- ambiguous display aliases rejected,
- duplicate canonical IDs rejected,
- approval invalidated when origin/schema changes,
- live-generation match required at dispatch,
- fail closed on ambiguity,
- audit includes canonical identity metadata but never requires raw secrets.

Integrators may replace SHA-256 IDs with database keys, signed capability IDs, or another deterministic mechanism as long as the observable invariants in [`rules/engineering-rules.md`](rules/engineering-rules.md) remain true.

## Usage

### Derive one identity
Create a raw registration record:

```json
{
  "server_instance_id": "github-prod-readonly",
  "connection_generation": 3,
  "tool_name": "search",
  "display_alias": "github-prod.search",
  "transport": {
    "type": "streamable-http",
    "url": "https://mcp.example.com/mcp"
  },
  "input_schema": {
    "type": "object",
    "properties": {"q": {"type": "string"}},
    "required": ["q"]
  }
}
```

Run:

```bash
python scripts/tool_identity_guard.py derive --record candidate.json
```

### Audit a candidate catalog

```bash
python scripts/audit_tool_catalog.py catalog.json
```

Exit codes:
- `0`: catalog has no blocking identity findings,
- `2`: invalid input,
- `3`: blocking collision/identity finding,
- `4`: I/O error.

### Verify immediately before dispatch

```bash
python scripts/tool_identity_guard.py verify-invocation \
  --approval approval.json \
  --live live-record.json
```

Exit `0` means the bound identity matches. Exit `3` means the call must not be dispatched under that approval.

## Workflow
The standard lifecycle is defined in [`workflows/workflows.md`](workflows/workflows.md):

1. **Catalog Admission** — derive all identities, scan collisions, invalidate replaced approvals, atomically expose the validated snapshot.
2. **Guarded Tool Invocation** — resolve exactly, approve by canonical ID, then revalidate against the live connection immediately before dispatch.
3. **Identity Regression Gate** — exercise collision, normalization, schema-drift, origin-drift, and stale-generation fixtures with independent verification.
4. **Wrong-Origin Incident Response** — quarantine, preserve evidence, reconstruct approved and actual identities, patch, add a regression fixture, and independently re-enable.

Every loop is bounded. Identity mismatch never triggers an automatic retry against another similarly named tool.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) provides complete executable procedures for:
- canonical identity creation,
- approval/policy origin binding,
- multi-server catalog auditing,
- wrong-origin incident investigation.

Each skill defines trigger, inputs, context, tools, procedure, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) groups testable controls into MUST / MUST NOT / SHOULD rules.

Critical invariants:
- an alias resolves to exactly one live canonical ID,
- approval and dispatch use the same canonical ID,
- origin/schema/generation changes invalidate identity-bound decisions,
- security policy never falls back to fuzzy name matching,
- server-provided names and annotations do not define authorization identity.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) defines three non-overlapping roles:
- **Registry Identity Analyst** — read-only identity mapping and collision analysis,
- **Guard Integration Engineer** — host integration and regression implementation,
- **Independent Security Verifier** — independent proof that decision identity equals dispatch identity.

The implementer is not the sole verifier.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines:
- pre-registration identity derivation,
- catalog collision gating,
- approval binding,
- pre-dispatch live revalidation,
- post-dispatch audit correlation,
- release security gating.

Deterministic scripts own checks that should not depend on model reasoning.

## Scripts

### `scripts/tool_identity_guard.py`
Provides:
- canonical JSON serialization,
- safe remote-origin normalization,
- stdio transport fingerprint material,
- schema hashing,
- origin fingerprinting,
- canonical tool-ID derivation,
- approval/live identity comparison.

It intentionally excludes credentials, headers, URL queries, and fragments from remote origin identity output.

### `scripts/audit_tool_catalog.py`
Detects:
- missing identity fields,
- inconsistent canonical-ID reuse,
- ambiguous display aliases,
- case/separator normalization collisions,
- reused server-reported names,
- multiple live generations for one instance/tool pair.

The scanner is metadata-only and does not connect to or execute MCP tools.

## Tests
[`tests/test_tool_identity_guard.py`](tests/test_tool_identity_guard.py) covers:
- deterministic identity derivation,
- distinct host instance identities,
- schema changes,
- generation changes,
- normalized HTTPS default port,
- exact invocation match,
- stale generation rejection,
- wrong-origin rejection,
- schema-drift rejection,
- safe duplicate protocol names across distinct aliases,
- blocking ambiguous aliases,
- blocking normalization collisions,
- warning-only reused server-reported names when host identity remains unambiguous.

## Metrics
Recommended production metrics:
- total canonical registry entries,
- ambiguous alias rejections,
- normalization collision rejections,
- stale generation rejections,
- origin mismatch rejections,
- schema mismatch rejections,
- approval-to-dispatch identity match ratio,
- identity churn per server instance,
- approval invalidations after refresh/reconnect,
- catalog audit latency,
- registry swap latency.

A deployment should define a baseline before enabling enforcement and compare rejection/churn rates during staged rollout.

## Verification
See [`verification/verification-report.md`](verification/verification-report.md).

The report explicitly distinguishes:
- **Implemented:** deterministic identity, audit, rules, workflows, tests.
- **Measured:** no production host metrics are claimed in this package-generation run.
- **Verified:** source/problem consistency and package-level invariants were reviewed; target-host runtime effectiveness still requires integration tests at the concrete dispatch boundary.

Do not claim production protection solely because the scripts exist. The identity comparison must be placed immediately before the real transport call.

## Safety
- Fail closed on ambiguous identity.
- Never expose credentials in identity records or audit logs.
- Do not use server-reported names as principals.
- Do not silently select the first collision.
- Do not retry a mismatch against a different origin.
- Do not weaken approval, sandbox, or validation policy to preserve compatibility.
- Preserve incident evidence before reconnecting/resetting affected sessions.
- Require human review for dangerous or irreversible remediation of external side effects.

## Failure handling
**Detection:** guard/auditor nonzero exit, audit mismatch, registry ambiguity, stale generation, schema/origin change, unexpected destination.

**Evidence:** preserve candidate/live registry records, approval metadata, connection generation, request ID, and dispatcher identity without secrets.

**Retry policy:** at most one deliberate fresh registry refresh for stale metadata. Identity mismatch itself is not retried automatically.

**Fallback:** disable/quarantine the affected alias or server instance and use only a separately validated explicit identity.

**Escalation:** operator/security owner when origin cannot be proven or external effects need review.

**Stop condition:** affected identity remains disabled until independent verification confirms continuity.

## Definition of Done
A real integration is complete when all of the following are measurable and true:
- evidence and current limitations documented,
- every live MCP tool has a canonical identity,
- no model-visible alias resolves ambiguously,
- approval and policy stores key on canonical identity,
- dispatcher consumes the validated canonical registry entry/connection handle rather than re-resolving display names,
- origin/schema/generation changes invalidate older decisions,
- all provided regression tests pass,
- collision and drift fixtures are rejected as specified,
- benign same-name tools across distinct servers remain usable through explicit aliases,
- audit correlation proves approval identity equals dispatch identity,
- metrics are collected,
- independent verification completed,
- no blocking issue remains.

## Customization
See [`guide-intergration.md`](guide-intergration.md) for staged rollout and adapter guidance.

The package is intentionally framework-neutral. It can be integrated into a custom MCP host, coding agent, multi-agent orchestrator, desktop client, CI agent, or MCP gateway. Replace implementation details as needed, but preserve the central contract: **tool identity is a structured, host-controlled origin-bound principal, not a display string.**