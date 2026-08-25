# MCP Tool Annotation Trust Gate

**Category:** Security

## Problem
MCP `ToolAnnotations` are useful for permission UX but are explicitly untrusted hints unless the server is trusted. Current clients show both sides of the gap: some approval engines cannot consume annotations, while other modes can surface tools based on server-controlled `readOnlyHint`. A safe host needs a deterministic trust boundary rather than either ignoring all metadata or trusting it blindly.

## Evidence
See `evidence/research.md` for current public evidence, including MCP specification guidance and 2026 Claude Code, Vercel Eve, Gemini CLI, and GitHub MCP Server reports.

## Existing approach
Common approaches are prompt-every-time, name-based rules, server allowlists, or direct use of `readOnlyHint`.

## Existing limitations
Prompt-every-time creates approval fatigue; name-only rules drift; and direct annotation trust lets an untrusted server lower apparent risk.

## Proposed improvement
Normalize MCP hints under an explicit local server-trust policy. Untrusted hints may raise risk but never lower it. Missing fields use pessimistic MCP defaults. The evaluator returns an auditable `allow|ask|deny` decision and reason codes.

## Architecture
- `scripts/mcp_annotation_gate.py` — deterministic evaluator.
- `config/policy.example.json` — local trust/policy example.
- `rules/trust-boundary.md` — enforceable invariants.
- `skills/annotation-risk-audit.md` — reusable audit procedure.
- `subagents/annotation-security-reviewer.md` — independent verifier.
- `workflows/audit-and-enforce.md` — bounded implementation workflow.
- `hooks/pre-tool-approval.md` — integration contract.
- `tests/test_mcp_annotation_gate.py` — adversarial regression tests.
- `evidence/research.md` — research and root-cause evidence.

## Actual package tree
```text
README.md
config/policy.example.json
evidence/research.md
hooks/pre-tool-approval.md
rules/trust-boundary.md
scripts/mcp_annotation_gate.py
skills/annotation-risk-audit.md
subagents/annotation-security-reviewer.md
tests/test_mcp_annotation_gate.py
workflows/audit-and-enforce.md
```

## Installation
Requires Python 3.9+ and no third-party packages.

## Configuration
Copy `config/policy.example.json` to a host-controlled path. Populate `trusted_servers` from an identity/trust process independent of MCP metadata.

## Usage
Create a JSON input:
```json
{"server":"corp-github","tool":"pull_request_read","annotations":{"readOnlyHint":true,"destructiveHint":false,"openWorldHint":false}}
```
Run:
```bash
python3 scripts/mcp_annotation_gate.py --input decision.json --policy policy.json
```
Exit codes: `0=allow`, `10=ask`, `20=deny`, `30=invalid input/policy`.

## Workflow
Follow `workflows/audit-and-enforce.md`: observe → baseline → diagnose → hypothesize → integrate → measure again → independent verification.

## Metrics
Track approval rate for trusted read-only calls, untrusted risk-lowering hint attempts, conservative-default use, decision coverage, and false auto-approvals.

## Verification
Run:
```bash
python3 -m unittest tests/test_mcp_annotation_gate.py
```
**Implemented** means the gate is wired into authorization. **Measured** means before/after decision matrices exist. **Verified** means adversarial tests pass and an independent reviewer confirms no untrusted hint can lower policy.

## Safety
This package is not a sandbox or authorization system. It must not weaken network, credential, filesystem, or resource controls. Dangerous or irreversible actions require explicit human approval unless a separate hard policy safely denies or authorizes the exact operation.

## Failure handling
Malformed metadata or policy fails closed. Retry implementation at most twice, changing the hypothesis each time. If server trust provenance is unclear or a destructive tool auto-approves, stop and escalate.

## Definition of Done
Evidence documented; trust source explicit; gate integrated; baseline/post metrics captured; all tests pass; independent review complete; no untrusted annotation lowers security; no blocking issue remains.

## Customization
Hosts may tighten `ask` to `deny`, add exact tool deny lists, or implement stronger server identity attestation. Never permit server-provided metadata to establish its own trust.
