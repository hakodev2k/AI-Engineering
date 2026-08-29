# MCP App Tool Origin Provenance Gate

**Category:** Security  
**Run date:** 2026-08-30 (UTC+7)

## Problem
MCP Apps allow the same tool to be visible to both the model and an embedded app. A server receiving `tools/call` may therefore see identical tool name and arguments from two materially different initiating principals, while current protocol messages do not provide a standardized, trustworthy per-call signal that proves whether the call originated from the model or the app. This makes origin-sensitive authorization, approval, auditing, and incident attribution fragile.

## Evidence
See `evidence/research.md`. The strongest current signal is MCP Apps issue #738 (2026-08-04), which explicitly requests host-attested invocation provenance for dual-visible tools. The MCP Apps specification also defines tool visibility and requires hosts to gate app-originated calls, while security guidance recommends attribution/auditability.

## Existing approach
Hosts already enforce app tool visibility and can keep implementation-specific request context. Servers can also apply normal authentication/authorization and tool-specific approval rules.

## Existing limitations
Tool visibility is capability exposure, not per-call proof of initiator. Caller-supplied metadata is forgeable. Tool/server identity does not answer who initiated this invocation. A server-side policy cannot safely infer origin from arguments, UI state, request timing, or tool visibility alone.

## Proposed improvement
Introduce a host-controlled provenance record at the application boundary. The record carries a trusted `host_attested_origin` (`app`, `model`, `user`, or `host`) independently of tool arguments. Unknown origin fails closed for origin-sensitive tools. Provenance never substitutes for authentication, resource authorization, argument validation, sandboxing, or human approval.

## Architecture
```text
README.md
evidence/research.md
schemas/tool-origin-record.schema.json
skills/tool-origin-provenance-audit.md
rules/origin-provenance-rules.md
subagents/provenance-reviewer.md
subagents/security-verifier.md
workflows/provenance-enforcement.md
hooks/pre-tool-call-origin-gate.md
scripts/origin_provenance_gate.py
tests/test_origin_provenance_gate.py
```

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/origin_provenance_gate.py --input call.json --json-out report.json
python -m unittest tests/test_origin_provenance_gate.py
```

## Metrics
- origin-sensitive calls with trusted provenance;
- unknown-origin block rate;
- forged/untrusted origin marker detections;
- visibility-policy violations;
- approval-to-origin mismatch rate;
- security regression test pass rate.

## Verification status
**Implemented:** deterministic provenance policy gate, schema, rules, hook, tests.  
**Measured:** package-level test matrix exercises app/model/unknown/forged-marker cases.  
**Verified:** deterministic unit tests must pass before integration; production effectiveness still requires host integration proving the provenance field is injected by the trusted Host path and cannot be set by the app/model payload.

## Safety
Provenance is not authentication. The package MUST NOT expand permissions or bypass approvals. Unknown provenance blocks origin-sensitive calls. Logs should record origin and decision without secrets or unnecessary arguments.

## Failure handling
Detection: missing/invalid host-attested origin, visibility mismatch, stricter origin allowlist mismatch, test failure. Retry once only after refreshing trusted host context. Otherwise block, preserve evidence, and escalate. Never downgrade a sensitive call to `unknown` and allow it for compatibility.

## Definition of Done
Evidence documented; origin-sensitive tool inventory captured; trusted host injection point identified; gate implemented; tests pass; normal authorization remains intact; forged caller markers are ignored; unknown origin fails closed where required; independent verifier confirms the real dispatch path cannot bypass the gate.

## Customization
Map host-specific request context into `host_attested_origin`, but keep that field outside untrusted tool arguments and preserve the rules in `rules/origin-provenance-rules.md`.
