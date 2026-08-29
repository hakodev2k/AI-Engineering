# Minimum-Necessary Tool Argument Gate

**Category:** Security

## Problem
LLM agents often pass more sensitive data to tools than the tool needs. That creates unnecessary privacy exposure across MCP, SaaS APIs, telemetry, and other trust boundaries.

## Evidence
See `evidence/research.md`. Current evidence includes the August 25, 2026 ToolMinimize study, the reviewed dbt MCP telemetry advisory (CVE-2026-44970), and current public issues showing sensitive session/tool data can be propagated or persisted unexpectedly.

## Existing approach
Common defenses rely on allow/block gates, PII regexes, tool permissions, secret scanners, or generic “do not expose sensitive data” prompts.

## Existing limitations
Those controls often decide whether a call is allowed, but not whether every argument value is necessary. Free-text fields and semantically sensitive values can still carry excess data, while blanket redaction can break valid tasks.

## Proposed improvement
Add a deterministic pre-tool boundary that applies per-tool allowlists, field strategies, secret/PII detection, truncation, and human-review escalation before external transmission. The gate must preserve task-required data and record exactly what was transformed.

## Architecture
```text
README.md
evidence/research.md
config/policy.example.json
skills/tool-argument-minimization.md
rules/privacy-boundary-rules.md
subagents/privacy-reviewer.md
workflows/audit-rewrite-verify.md
hooks/pre-tool-privacy-gate.md
scripts/tool_arg_minimizer.py
tests/test_tool_arg_minimizer.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/policy.example.json` and define tool-specific allowed fields, sensitive field names, transformations, and review behavior.

## Usage
```bash
python scripts/tool_arg_minimizer.py request.json --policy config/policy.example.json --out sanitized.json
python -m unittest tests/test_tool_arg_minimizer.py
```

Input format:
```json
{"tool":"crm.search","args":{"query":"Jane Doe jane@example.com","api_key":"secret"}}
```

## Workflow
Follow `workflows/audit-rewrite-verify.md`: Observe → classify trust boundary → establish baseline exposure → minimize → validate task semantics → independent privacy review → complete.

## Metrics
- sensitive fields transmitted per call
- sensitive characters transmitted per call
- unnecessary-field rate
- human-review rate
- task-validity pass rate
- false-positive redaction rate
- blocked secret transmissions

## Verification
**Implemented:** policy and deterministic sanitizer exist.  
**Measured:** baseline and post-gate exposure metrics are captured on representative calls.  
**Verified:** sensitive exposure is lower while required argument-level task behavior still passes.

## Safety
The gate MUST NOT silently weaken authentication, authorization, auditability, or correctness. It MUST NOT invent replacement values for identity-sensitive operations. When minimization could change a payment, permission, production write, account identity, or irreversible action, require explicit human approval.

## Failure handling
Fail closed for detected secrets in disallowed fields. For ambiguous semantic data, emit `review_required` rather than guessing. Maximum automatic rewrite attempts: 2. After two failures, preserve the original request locally, do not transmit it, and escalate.

## Definition of Done
Evidence documented; baseline captured; policy configured; sanitizer tests pass; sensitive exposure decreases; task-validity checks pass; no secrets are transmitted in blocked fields; review paths are exercised; an independent reviewer approves the result.
