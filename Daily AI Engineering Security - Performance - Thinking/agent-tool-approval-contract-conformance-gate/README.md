# Agent Tool Approval Contract Conformance Gate

**Category:** Security

## Problem
Agent runtimes can expose high-risk tools whose local metadata silently weakens the user's global approval policy. A tool marked `auto` or equivalent can turn prompt-influenced arguments into host code execution without the approval step operators expect.

## Evidence
See `evidence/research.md` for August 2026 CVE evidence and current agent-security guidance.

## Existing approach
Platforms use global approval modes, per-tool annotations, sandboxes, prompt-injection defenses, and human confirmation. These are useful, but a tool implementation can still create a policy mismatch if its own approval contract is treated as authoritative.

## Existing limitations
Model-level guardrails cannot protect a path that invokes an auto-approved executor; a global approval setting is ineffective if tool metadata bypasses it; sandboxing is a separate boundary and may be absent or incomplete.

## Proposed improvement
Validate every registered tool against a centrally owned consequence policy before the tool becomes callable. High-risk categories cannot declare weak approval semantics and code/shell/host-write tools must also attest sandboxing. Fail closed on missing or conflicting metadata.

## Architecture
- `evidence/research.md` — evidence, existing approaches, limitations, root cause
- `config/policy.json` — central consequence policy
- `skills/tool-approval-threat-analysis.md` — reusable analysis procedure
- `rules/approval-contract.md` — enforceable invariants
- `subagents/security-reviewer.md` — independent reviewer
- `workflows/registration-and-diagnosis.md` — bounded registration workflow
- `workflows/regression-verification.md` — security regression path
- `hooks/pre-tool-registration.md` — blocking startup hook
- `scripts/tool_approval_gate.py` — deterministic validator
- `tests/test_tool_approval_gate.py` — executable tests

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` to define high-risk categories and categories requiring sandboxing. Do not downgrade risk only to make registration succeed.

## Usage
`python scripts/tool_approval_gate.py --manifest tool-manifest.json --policy config/policy.json`

## Metrics
High-risk tools with enforcing approval; high-risk tools sandboxed; registration blocks; policy drift count; attack-fixture block rate.

## Verification
Run `python -m unittest tests/test_tool_approval_gate.py` and independently inspect the effective runtime registry.

## Safety
The gate only tightens approval/sandbox requirements. It never stores credentials, executes model-generated code, or auto-approves dangerous actions.

## Failure handling
Malformed or ambiguous manifests block registration. Maximum diagnosis retries: 2. Fallback: disable the affected tool. Human approval is required before changing a high-risk classification.

## Definition of Done
**Implemented:** registry hook and policy are active.  
**Measured:** all registered tools are classified and policy coverage is recorded.  
**Verified:** attack fixtures are blocked, safe read-only tools remain usable, security tests pass, and an independent reviewer confirms the effective runtime cannot weaken global policy.

## Customization
Add product-specific categories and approval labels through an explicit mapping layer. Unknown labels should fail closed for high-risk tools.
