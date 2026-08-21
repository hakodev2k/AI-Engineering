# Agent MCP Tool Manifest Drift Approval Guard

## Topic
Prevent unreviewed MCP tool-definition changes from silently entering an AI agent after the server or tool surface was previously approved.

## Category
**Security**

## Problem
MCP servers advertise tools dynamically. Between initial approval and a later reconnect, refresh, cache expiry, or `tools/list_changed` event, the server may return a different description, schema, annotation, identity, or tool set. A legitimate release can cause this; a compromised or malicious server can exploit it as a tool-poisoning/rug-pull path. If the host treats current discovery as automatically authorized, the model can receive capabilities or instructions the user never reviewed.

Authentication and TLS do not solve this approval-continuity problem. They can prove which endpoint published the current manifest, but not whether the newly published semantics remain within the previously approved capability boundary.

## Evidence
`evidence/research.md` documents current public signals and separates observed evidence from interpretation and the package's proposed engineering solution. Key signals include:

- active June 2026 MCP discussion proposing signed manifests specifically for rug-pull/tool-poisoning defense;
- VS Code handling dynamic `tools/list_changed` updates in production MCP flows;
- Microsoft 365 Copilot documentation describing runtime tool discovery, diffing, validation, and application;
- July 2026 MCP freshness/cache semantics that make refetch behavior more explicit without turning fresh metadata into automatically approved metadata;
- 2026 ecosystem research measuring tool-definition drift across published MCP servers.

## Existing approach
Common approaches include trusting the authenticated server, refetching `tools/list` on every session, pinning tools in application manifests, signing manifests, and using an LLM to summarize changes.

## Existing limitations
- Authentication/provenance does not mean semantic re-approval.
- Fresh refetching can accelerate an unsafe change if live definitions replace approved definitions immediately.
- Permanent pinning sacrifices dynamic discovery and operational flexibility.
- Signed manifests are valuable but a valid signature still does not prove that a human approved a legitimate publisher's new behavior.
- LLM-only semantic review is non-deterministic and can be influenced by poisoned descriptions.

## Proposed improvement
Create an explicit approval-continuity layer between MCP discovery and the agent-visible tool registry:

1. canonicalize the approved manifest;
2. hash and persist it with an external approval id;
3. compare every future refreshed manifest deterministically;
4. classify added/removed tools and description/schema/annotation/identity changes;
5. quarantine high/critical drift before model visibility or invocation;
6. require independent approval before writing a new baseline;
7. preserve prior baselines and drift reports for audit.

The implementation intentionally separates **discovered state** from **approved state**.

## Architecture

```text
Authenticated MCP server
        |
        v
 tools/list / list_changed
        |
        v
  Discovered Manifest (staging)
        |
        v
 scripts/manifest_guard.py check
        |                     \
        | pass                 \ blocked/error
        v                       v
 Approved Tool Registry      Quarantine + Drift Report
        |                       |
        v                       v
 Model-visible tools        Security Review
        |                       |
        v                       v
 Invocation Router       explicit approval id
                                |
                                v
                  manifest_guard.py snapshot
                                |
                                v
                    New Baseline Revision
```

The MCP server must not have write authority over the approval baseline store.

## Package structure

```text
agent-mcp-tool-manifest-drift-approval-guard/
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
│   └── manifest_guard.py
└── tests/
    └── test_manifest_guard.py
```

## Installation
Requirements:

- Python 3.10+ recommended;
- no third-party Python dependencies;
- an MCP host/client capable of exporting stable `tools/list` data before publishing it to the model-visible registry.

Validate locally:

```bash
python tests/test_manifest_guard.py
```

## Configuration
`config/policy.json` contains:

- canonicalization behavior;
- ignored volatile metadata paths;
- drift-kind risk levels;
- blocked risk levels;
- maximum manifest/tool limits.

Default blocking levels are `high` and `critical`. New tools, description changes, input-schema changes, safety-annotation changes, and server-identity changes therefore block by default.

Review `ignore_tool_fields` for your MCP implementation. Never ignore fields that influence model planning, permissions, routing, authorization, or data access.

## Manifest input
The script expects:

```json
{
  "server": {
    "identity": "https://mcp.example.com",
    "version": "1.2.3"
  },
  "tools": [
    {
      "name": "read_issue",
      "description": "Read one issue",
      "inputSchema": {"type": "object"},
      "annotations": {"readOnlyHint": true}
    }
  ]
}
```

Do not include access tokens, authorization headers, cookies, OAuth codes, user payloads, or runtime tool results.

## Usage

### Initial approved snapshot
After independent review:

```bash
python scripts/manifest_guard.py snapshot \
  --manifest current.json \
  --baseline approved.json \
  --policy config/policy.json \
  --approval-id CHANGE-1234
```

Then round-trip verify:

```bash
python scripts/manifest_guard.py check \
  --manifest current.json \
  --baseline approved.json \
  --policy config/policy.json
```

### Runtime comparison

```bash
python scripts/manifest_guard.py check \
  --manifest current.json \
  --baseline approved.json \
  --policy config/policy.json \
  --report drift-report.json
```

Exit codes:

- `0` — pass;
- `2` — drift blocked by policy;
- `3` — invalid input/policy/baseline;
- `4` — I/O/runtime failure.

`check` never modifies the baseline.

## Workflow
`workflows/workflows.md` defines four bounded workflows:

- first approval;
- runtime drift reconciliation;
- legitimate drift re-approval;
- suspected rug-pull/security incident handling.

Transient manifest fetches may retry at most twice. Critical drift is not placed in an automated retry loop; it remains quarantined until explicit review.

## Skills
`skills/core-skills.md` provides reusable procedures for:

- establishing an approved MCP tool baseline;
- reconciling runtime drift;
- safely re-approving legitimate changes.

Each skill includes trigger, inputs, preconditions, context, procedure, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` contains enforceable **MUST / MUST NOT / SHOULD** requirements. The most important rule is that refreshed discovery state must not automatically become approved model-visible state.

## Subagents
`subagents/subagents.md` separates responsibilities across:

- Manifest Evidence Analyst;
- Security Reviewer;
- Baseline Custodian;
- Verification Agent.

The component that writes an approved baseline does not approve its own change, and the implementation agent is not the sole verifier.

## Hooks
`hooks/hooks.md` defines predictable enforcement points:

- before discovered tools are published;
- on `tools/list_changed`;
- on TTL/cache refresh;
- before tool invocation;
- after explicit approval;
- during final deployment verification.

## Metrics
Track at least:

- manifest checks by server/status;
- drift events by risk and kind;
- blocked/quarantined tool count;
- guard duration p50/p95/p99;
- time from drift detection to review;
- baseline age;
- false-positive/no-op drift rate;
- number of unapproved changed-tool invocation attempts (target: zero successful calls).

Performance target for this package: measure locally and aim for <100 ms comparison time for a typical <=500-tool manifest on a developer machine. Do not claim this target is achieved until measured in the integration environment.

## Verification
Verification is evidence-based and split into three states.

### Implemented
- discovery pipeline invokes deterministic comparison;
- trusted baseline is outside MCP server write authority;
- changed/new high-risk tools are withheld from model-visible registry and invocation path;
- baseline update requires a separate snapshot action with approval id.

### Measured
- guard latency captured;
- drift type/risk counts captured;
- quarantine count captured;
- false positives measured on representative real manifests.

### Verified
- `tests/test_manifest_guard.py` passes;
- host-level test proves a description mutation is not model-visible;
- host-level test proves a new tool cannot be invoked before approval;
- server identity change fails closed;
- key/order-only canonical changes do not alert;
- re-approved exact digest becomes available while prior baseline remains auditable.

The included stdlib test suite covers round-trip stability, key-order normalization, description drift, new tools, input-schema drift, server-identity drift, and the invariant that `check` cannot mutate the baseline.

## Safety
- Never allow the MCP server to self-approve its own manifest.
- Never expose blocked tools to the model and rely on a natural-language instruction not to call them.
- Never treat a signed changed manifest as automatically authorized.
- Never invoke suspicious changed tools against production data merely to test them.
- Do not weaken the risk policy to restore availability during unexplained high/critical drift.
- Credentials and runtime user data must not be embedded in manifests, reports, metrics, or baselines.
- Newly destructive or data-exporting capabilities require independent review and preferably sandbox testing.

## Failure handling

### Detection
Comparator nonzero exit, unreadable baseline, duplicate tool names, oversized manifest, identity mismatch, or a blocked drift report.

### Evidence
Preserve old baseline, current manifest, policy, drift report, server/package version, discovery timestamp, and external release/change evidence. Exclude credentials.

### Retry policy
- transient manifest-fetch error: maximum 2 retries with bounded backoff;
- parser/policy/baseline/identity error: no automatic retry that changes policy/state;
- critical drift: no retry loop; quarantine and review.

### Fallback
Use the last known approved server/client version only if the host can prove it still maps to the approved manifest and invocation boundary. Otherwise keep server tools unavailable.

### Escalation
Escalate unexplained high/critical drift to the platform/security owner and MCP server owner. If compromise is plausible, use existing incident procedures for credential rotation and downstream impact analysis.

### Stop condition
Stop automated progression whenever the active manifest cannot be proven approved. Never hide failure by snapshotting the live state automatically.

## Definition of Done
A deployment is complete only when all are true:

- evidence and current-solution limitations documented;
- stable server identity defined;
- baseline generated with explicit approval id;
- discovery refresh path gated;
- `tools/list_changed` path gated;
- pre-invocation registry assertion present or equivalent enforcement proven;
- high/critical drift quarantined before model visibility;
- deterministic regression tests pass;
- guard latency and drift metrics collected;
- old/new baselines and review evidence retained;
- no secrets are stored in manifests/reports;
- independent verification confirms unapproved changed tools cannot execute;
- no blocking unresolved integration issue remains.

## Customization
You can extend `manifest_guard.py` and `policy.json` for:

- organization-specific annotations;
- finer JSON Schema diff classification (required vs optional fields, type widening, enum expansion);
- cryptographic manifest signature verification before approval comparison;
- package provenance/SBOM attestation;
- server-specific permitted low-risk metadata;
- append-only baseline stores;
- policy-as-code approval services;
- OpenTelemetry metrics and security event export.

Keep the invariant unchanged: **a live manifest becoming fresh is not the same event as that manifest becoming approved.**
