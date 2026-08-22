# MCP Approval-View Fidelity Guard

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem

MCP's consent model depends on users understanding a tool before authorizing it, but a host can accidentally show a human a different effective representation from the metadata delivered to the model. Recent research demonstrates one concrete case: Unicode TAG-block characters can be visually absent in approval/review surfaces while remaining in the underlying tool metadata consumed by the model. The same class of boundary also enables a post-approval metadata “rug pull” when a descriptor changes but approval is remembered by tool identity rather than descriptor content.

The current MCP specification requires explicit consent and cautions clients about untrusted tool descriptions/annotations, but it does not define canonical approval rendering or a mandatory descriptor-digest re-approval protocol. This kit adds that missing host-side invariant.

## Improvement

Bind approval to **content**, not only identity:

```text
tools/list
   |
   v
Unicode reviewability check ---- block ----> audit reason
   |
   v
canonical security descriptor
   |                     \
   |                      -> human approval view
   v
SHA-256 digest
   |
   v
approval(server + tool + digest + policy version)
   |
   +--> pre-model digest check
   |
   +--> pre-invocation digest check
             |
             +-- mismatch --> REAPPROVAL_REQUIRED
```

## Package layout

```text
mcp-approval-view-fidelity-guard/
├── README.md
├── evidence/research.md
├── config/policy.example.json
├── skills/approval-view-fidelity.md
├── rules/mcp-metadata-approval.md
├── subagents/mcp-metadata-reviewer.md
├── workflows/approval-and-drift-gate.md
├── hooks/pre-model-tool-metadata.sh
├── hooks/pre-mcp-invoke.sh
├── scripts/mcp_descriptor_guard.py
├── scripts/test_guard.py
└── examples/clean-tool.json
```

## Quick start

Requires Python 3.9+ and no third-party packages.

Copy this entire directory into a trusted tooling location and run commands from the copied package root; no collection-level files are required.

```bash
python scripts/mcp_descriptor_guard.py check examples/clean-tool.json
python scripts/mcp_descriptor_guard.py approve examples/clean-tool.json \
  --server mcp://docs --out approval.json
python scripts/mcp_descriptor_guard.py verify examples/clean-tool.json approval.json \
  --server mcp://docs
python scripts/test_guard.py
```

Expected regression cases:

- clean descriptor can be approved;
- unchanged descriptor verifies;
- JSON key reordering does not invalidate approval;
- changed description invalidates approval;
- Unicode TAG concealment is rejected before approval;
- a different server identity cannot reuse the approval.

## Integration pattern

### 1. At discovery

Capture the server-resolved identity and raw descriptor. Run `check` before the metadata reaches an approval renderer or model context. A non-zero exit is a hard block.

### 2. At approval

Build the human review surface from the same canonical security descriptor represented by `canonical_bytes()`. After explicit human approval, call `approve` and persist the record in your host's approval store. Production hosts should store it in their existing encrypted/configuration storage rather than an arbitrary working-directory file.

### 3. Before model exposure

Export the exact current descriptor to a temporary JSON file and run:

```bash
hooks/pre-model-tool-metadata.sh current.json approval.json mcp://docs
```

Only inject the descriptor if exit code is zero.

### 4. Before invocation

If metadata can refresh asynchronously, run `hooks/pre-mcp-invoke.sh` against a freshly read descriptor. Exit code `3` means the content no longer matches the approved digest and the invocation must be cancelled pending human re-review.

## Exit codes / reason codes

| Exit | Reason | Host action |
|---:|---|---|
| 0 | `APPROVAL_MATCH` / clean | continue |
| 2 | `UNREVIEWABLE_UNICODE` | block metadata and inspect |
| 3 | `REAPPROVAL_REQUIRED` | remove/disable tool until human review |

## What is canonicalized

The reference script includes `name`, `title`, `description`, `inputSchema`, `outputSchema`, and `annotations` when present. JSON object keys are sorted and compactly serialized as UTF-8. Adapt `FIELDS` if your host sends additional metadata to the model; the critical rule is that every model-visible/security-relevant field must be included.

## Unicode policy

The script blocks:

- Unicode TAG block `U+E0000..U+E007F`;
- bidi controls;
- common zero-width format characters;
- other `Cc`/`Cf` controls except tab/newline/carriage return.

This is intentionally fail-closed. International visible text is not rejected merely for being non-ASCII. If a product legitimately requires a blocked codepoint, do not simply remove the check: first implement an approval representation that makes the codepoint explicit and bind that representation to the same canonical bytes.

## Threat model

Covered:

- invisible instructions hidden in model-visible tool metadata;
- approval/model representation mismatch for configured dangerous Unicode;
- descriptor mutation after approval;
- approval reuse across a different server identity;
- harmless JSON key-order changes.

Not covered by itself:

- malicious behavior behind an unchanged descriptor;
- poisoned tool results/resources after invocation;
- compromised host/runtime;
- unsafe tool arguments or excessive permissions;
- authentication/session attacks;
- all possible Unicode confusables or renderer bugs.

Keep per-call authorization, least privilege, output/content defenses, sandboxing, and server authentication in place.

## Production hardening

The supplied script is a minimal dependency-free reference boundary. For production:

1. define server identity from authenticated transport/configuration rather than user-supplied text;
2. include every field your client exposes to the model;
3. version canonicalization and policy changes explicitly;
4. atomically update approval records only after human action;
5. keep descriptor refresh and invocation synchronized enough to avoid TOCTOU gaps;
6. add structured telemetry for block reason, server/tool IDs, old/new digests, and changed fields;
7. test the actual UI renderer, not only the Python validator, with invisible-Unicode fixtures.

## Verification

Run `python scripts/test_guard.py`. The included test harness creates its own temporary fixtures, including real TAG characters, so the malicious sample does not need to be stored in a visually deceptive repository file.

Success target: all six checks print `PASS` and the process exits `0`.

## Evidence

See `evidence/research.md` for the research chain, current public signals, existing approaches, limitations, root-cause hypotheses, and success metrics.

Key public sources:

- MCP specification 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28
- MCP tools security guidance: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
- Rashidi, Unicode TAG-Block Concealment (July 2026): https://arxiv.org/abs/2607.05744
- Microsoft Agent Governance Toolkit MCP security implementation: https://github.com/microsoft/agent-governance-toolkit/blob/main/agent-governance-python/agent-os/src/agent_os/mcp_security.py
- MCP client threat-modeling study (March 2026): https://arxiv.org/abs/2603.22489

## Engineering decision

Do not make “the approval dialog looked fine” a security invariant. Make the invariant machine-checkable: **the canonical descriptor digest approved by the human is exactly the digest authorized for model exposure and invocation**.
