# Streamed Tool Call Transaction Integrity Guard

**Category:** Thinking

## Problem
Streaming transport or parser faults can leave tool arguments partial, duplicated, or malformed. If a runtime repairs the payload into a different executable call and continues, later planning may incorrectly assume the intended side effect occurred.

## Evidence
See `evidence/research.md` for current Hermes Agent, Microsoft Agent Framework, Anthropic SDK, and OpenAI Agents SDK signals.

## Existing approach and limitations
Best-effort JSON repair, `{}` substitution, whole-turn retry, and schema validation each solve only part of the problem. They do not necessarily prove stream completeness, preserve original evidence, or establish whether a write already started before retry.

## Proposed improvement
Treat every streamed tool call as a transaction with immutable raw evidence and explicit assembly/execution state. A call becomes executable only after terminal stream evidence, JSON validation, required-field validation, and identity consistency. Recovery is bounded and depends on whether execution definitely started.

## Architecture
```text
streamed-tool-call-transaction-integrity-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-invocation.md
├── rules/transaction-rules.md
├── scripts/transaction_guard.py
├── skills/validate-streamed-tool-transaction.md
├── subagents/transaction-verifier.md
├── tests/fixtures.json
└── workflows/observe-validate-recover-verify.md
```

## Installation
Python 3.10+; the deterministic guard uses only the standard library. Integrations SHOULD add their native JSON-schema validator after parsing and before invocation.

## Configuration
`config/policy.json` defines retry budget, terminal-event requirement, empty-argument normalization policy, and execution states that block completion.

## Usage
Create a transaction envelope:
```json
{"call_id":"c1","tool":"write_file","raw_arguments":"{\"path\":\"a.txt\"}","terminal_event":true,"schema_allows_empty_object":false,"execution_state":"not-started","retry_count":0,"required_fields":["path"]}
```
Run:
```bash
python scripts/transaction_guard.py transaction.json --policy config/policy.json
```
Exit codes: `0` for `ready` or a permitted bounded `retry`; `2` invalid input/config; `3` blocking/reconciliation state.

## Workflow
Follow `workflows/observe-validate-recover-verify.md`. Preserve raw evidence before analysis, determine execution state, validate before side effects, retry only when definitely safe, then independently verify.

## Metrics
Track incomplete/malformed calls reaching execution, silent repairs, recovery success rate, retries/call, unresolved execution states, and false completion claims.

## Verification
`tests/fixtures.json` covers valid completion, mid-argument stream drop, unknown write state, and legitimate no-argument tools. Integrations should add provider-specific terminal-event fixtures and full schema validation.

## Safety
The package never reconstructs missing semantic content. It does not automatically replay writes with unknown execution status. Approval, authorization, secrets, sandbox, and downstream validation remain separate mandatory controls.

## Failure handling
Detection: missing terminal event, invalid JSON, required-field failure, call-ID conflict, or unknown execution state. Evidence: retain raw buffer and transaction hash. Retry policy: default maximum 2 and only when execution is definitely `not-started`. Fallback: explicit model-visible failure plus blocked dependent acceptance criterion. Escalation: human resolution for irreversible/unknown writes. Stop: identity conflict, unknown side effect, or exhausted retry budget.

## Definition of Done
- **Implemented:** every streamed invocation passes the pre-invocation transaction gate.
- **Measured:** baseline and guarded failure/recovery metrics are captured on equivalent fixtures/traces.
- **Verified:** no incomplete, malformed, conflicting, or unresolved transaction executes or supports a success claim; valid calls still execute; recovery is bounded; independent verification has no blocking findings.

## Customization
Adapt provider terminal-event detection and schema validation without weakening raw-evidence retention, execution-state tracking, or stop conditions.