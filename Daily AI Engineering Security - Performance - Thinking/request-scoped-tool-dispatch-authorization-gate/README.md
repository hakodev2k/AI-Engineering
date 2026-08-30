# Request-Scoped Tool Dispatch Authorization Gate

**Category:** Security  
**Run date:** 2026-08-31 (UTC+7)

## Problem
Agent frameworks can advertise a request-specific tool subset to the model while the runtime dispatcher still resolves tool names from a broader registry. That turns an intended authorization boundary into advisory metadata and lets prompt injection or malformed model output reach unadvertised capabilities.

## Evidence
`evidence/research.md` documents the current signals. The primary signal is Spring's 2026-08-20 advisory for CVE-2026-59318; supporting evidence covers dynamic runtime tool registration and independent technical analysis of broader-registry resolution.

## Existing approach
Upgrade patched framework versions, minimize global registrations, authorize again inside sensitive callbacks, sanitize untrusted content, and gate dangerous actions with human approval.

## Existing limitations
Framework patches do not prove application-specific wrappers, aliases, middleware, MCP gateways, or future resolver changes preserve the same boundary. Prompt defenses are not deterministic authorization. Callback-only checks are distributed and can drift.

## Proposed improvement
Make authorization a deterministic invariant immediately before resolution/execution: canonical requested tool identity must belong to the immutable request-scoped authorized set, with optional identity/tenant and exact approval binding.

## Architecture
- `evidence/research.md` — public evidence, current approaches, limitations, root causes.
- `skills/authorization-boundary-audit.md` — repeatable audit procedure.
- `rules/tool-dispatch-authorization.md` — enforceable security invariants.
- `subagents/security-reviewer.md` — independent verification role.
- `workflows/observe-fix-verify.md` — bounded remediation lifecycle.
- `hooks/pre-dispatch-gate.md` — deterministic execution boundary.
- `scripts/verify_tool_dispatch.py` — LLM-free trace verifier.
- `tests/test_verify_tool_dispatch.py` — negative/positive regression tests.
- `config/policy.example.json` — safe example policy.

## Actual package tree
```text
README.md
config/policy.example.json
evidence/research.md
hooks/pre-dispatch-gate.md
rules/tool-dispatch-authorization.md
scripts/verify_tool_dispatch.py
skills/authorization-boundary-audit.md
subagents/security-reviewer.md
tests/test_verify_tool_dispatch.py
workflows/observe-fix-verify.md
```

## Installation
Python 3.10+; no third-party Python dependencies are required for the verifier/tests.

## Configuration
Copy `config/policy.example.json`, define aliases and sensitive/approval-gated tools, and keep policy data free of secrets.

## Usage
```bash
python scripts/verify_tool_dispatch.py traces.jsonl --policy config/policy.example.json --json-out dispatch-report.json
python -m unittest tests/test_verify_tool_dispatch.py
```

Each JSONL trace record supplies `advertised_tools`, `requested_tool`, and whether the callback executed; optional fields cover resolved identity, approval, subject, and tenant binding.

## Workflow
Follow `workflows/observe-fix-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → independent verification. Maximum remediation cycles: 2.

## Metrics
- unauthorized callback executions: **0**
- sensitive-tool authorization decision coverage: **100%**
- false-denial rate on authorized controls
- authorization gate latency p50/p95

## Verification
**Implemented:** deterministic request-set check, canonicalization, approval/identity/tenant predicates, tests.  
**Measured:** baseline and post-change trace reports on the same corpus.  
**Verified:** forged unadvertised calls cannot reach callbacks; authorized controls remain functional; independent reviewer approves evidence.

## Safety
Use stubs/spies for destructive tools. Never prove a denial by attempting real irreversible actions. Never log credentials or unrestricted sensitive arguments. Human approval must bind to the exact action rather than a vague session-level consent.

## Failure handling
Detection: verifier violation, callback spy hit, identity mismatch, ambiguous alias, or failed regression test. Preserve evidence, disable the sensitive path or upgrade/patch, retry remediation at most twice, then escalate. Never add global resolver fallback to make tests pass.

## Definition of Done
Evidence documented; baseline captured; limitations/root cause recorded; pre-dispatch gate implemented; negative attacks blocked; positive controls pass; metrics collected; risks documented; approval requirements preserved; independent verification passes; no blocking issue remains.

## Customization
Adapters may map framework-specific traces into the JSONL schema, but the invariant must remain unchanged: the runtime must never execute a tool outside the authorization set computed for that exact request.
