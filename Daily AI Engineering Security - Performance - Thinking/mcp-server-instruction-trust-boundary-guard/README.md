# MCP Server Instruction Trust Boundary Guard

## Topic
Prevent server-controlled MCP instructions from silently becoming privileged agent control-plane authority.

## Category
Security

## Problem
MCP servers can supply natural-language instructions and tool metadata. When a client injects that content into privileged model context without provenance or action-time authorization, a malicious or compromised server can influence sensitive tool behavior through prompt injection.

## Evidence
See `evidence/research.md` for current public signals, official guidance, limitations, and source links.

## Existing approach
Common mitigations include server vetting, prompt separation, generic injection detection, least privilege, and user confirmation.

## Existing limitations
Trust can change after onboarding, model-only defenses are probabilistic, generic detection is incomplete, and confirmations can be stale or insufficiently bound to the exact server content that influenced an action.

## Proposed improvement
Add deterministic provenance and action-time enforcement. Hash each server instruction block, classify server trust explicitly, reject malformed/oversized metadata, and require approval bound to the current hash before untrusted instructions can influence high-impact capabilities.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `config/policy.json` — byte limits, trusted-server allowlist, high-impact capability policy.
- `scripts/instruction_gate.py` — deterministic allow/approval-required/deny gate.
- `rules/trust-boundary.md` — enforceable trust-boundary rules.
- `skills/instruction-provenance-analysis.md` — reusable analysis procedure.
- `subagents/security-reviewer.md` — independent verifier.
- `workflows/research-diagnose-enforce-verify.md` — bounded implementation/verification flow.
- `hooks/pre-tool-instruction-check.md` — deterministic pre-tool integration point.

## Installation
Requires Python 3.10+ and only the Python standard library. Copy this folder into the repository or agent-control project that hosts the MCP client.

## Configuration
Edit `config/policy.json`. Populate `trusted_servers` only after explicit review. Keep high-impact capability names aligned with the host tool/runtime vocabulary.

## Usage
Create an input JSON matching the shape documented in `scripts/instruction_gate.py`, then run:

`python scripts/instruction_gate.py input.json --policy config/policy.json`

Exit codes: `0` allow, `2` invalid input/config, `4` approval required, `5` deny.

## Workflow
Follow `workflows/research-diagnose-enforce-verify.md`. Capture the exact server instruction hash before integrating it into model context, then run the pre-tool hook for sensitive actions.

## Metrics
- provenance coverage = 100% for MCP instruction blocks;
- action-time check coverage = 100% for configured high-impact capabilities;
- stale approval acceptance = 0;
- malicious fixture pass-through = 0;
- benign low-risk fixture false-positive rate tracked explicitly.

## Verification
**Implemented:** deterministic validator, policy, rules, skill, reviewer role, workflow, and hook are included.

**Measured:** package-level behavior can be measured from gate exit codes and audit output. Production effectiveness is not claimed until integrated and tested in the target runtime.

**Verified:** verify locally with benign, malicious, changed-hash, stale-approval, oversized, and control-character fixtures; require independent review for production adoption.

## Safety
The package never reads secrets and does not grant server trust automatically. Missing provenance or malformed input blocks high-impact execution. Do not weaken policy to make a failing test pass.

## Failure handling
Detection is deterministic through non-zero exit codes. Maximum implementation retries: 2. Fallback is to disable the affected high-impact MCP action path. Escalate unresolved trust/provenance ambiguity to a human security owner. Stop rather than retry indefinitely.

## Definition of Done
- current evidence documented;
- server instruction provenance captured;
- trust policy explicit;
- high-impact calls checked at action time;
- changed instructions invalidate stale approval;
- malicious fixtures blocked;
- benign fixtures tested;
- independent reviewer passes the integration;
- no secrets included or exposed;
- all referenced package files exist.

## Customization
Extend capability names and trust sources to match the host runtime. If adding an injection classifier, treat its output as one signal in policy rather than the sole security boundary.