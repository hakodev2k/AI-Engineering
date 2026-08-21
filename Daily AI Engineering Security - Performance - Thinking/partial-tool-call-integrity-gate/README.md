# Partial Tool-Call Integrity Gate

**Category:** Security

## Problem
Streamed tool calls are assembled from partial fragments. If a stream is truncated, interrupted, or parsed inconsistently, an agent runtime can accidentally execute incomplete arguments, silently change semantics, duplicate side effects during retry, or leave a session with an unknown external state.

## Evidence
See `evidence/research.md`. Current public reports include Hermes Agent silently substituting incomplete tool arguments, OpenAI Agents Python differing between buffered and non-buffered completeness behavior, Kimi Code session-resume failures around interrupted tool calls, and framework documentation warning that partial streamed arguments can be incomplete even when best-effort parsing succeeds.

## Existing approach and limitation
Buffering, JSON/schema validation, generic retries, and history repair each solve part of the problem. They do not by themselves prove transport completion, authorization against finalized arguments, or whether a side effect already committed before a connection failure.

## Proposed improvement
Represent tool-call lifecycle explicitly and fail closed. Only a `complete`, terminally observed, schema-valid, authorized call can become `ready`. Side effects additionally require idempotency identity. If execution outcome becomes unknown, reconcile external state before retry. Mark a side effect `committed` only after its postcondition is verified.

## Architecture
- `evidence/research.md` — observed evidence, current approaches, gap, root causes.
- `config/tool-policy.json` — integrity and side-effect policy.
- `schemas/tool-call-envelope.schema.json` — lifecycle envelope contract.
- `scripts/tool_call_gate.py` — deterministic pre/post-execution integrity gate.
- `skills/tool-call-integrity-analysis.md` — investigation procedure.
- `rules/tool-execution-integrity-rules.md` — observable enforcement rules.
- `subagents/integrity-verifier.md` — independent verifier for high-risk changes.
- `workflows/stream-to-commit-integrity.md` — bounded lifecycle and recovery workflow.
- `hooks/pre-tool-execution-integrity-check.md` — deterministic execution hook.
- `tests/test_tool_call_gate.py` — adversarial lifecycle regression tests.

## Installation
Python 3.10+ is sufficient for the included gate. No third-party dependency is required. The host runtime must still perform real tool-schema validation and populate `schema_valid` only after full assembly.

## Configuration
Classify side-effecting tool names in `config/tool-policy.json`. Keep high-impact writes/executes/sends/deletes in the side-effect class. Empty argument objects are denied by default unless a specific tool is explicitly listed as safe with no arguments.

## Usage
Assemble an envelope after stream completion and run:

`python3 scripts/tool_call_gate.py envelope.json --policy config/tool-policy.json`

Only exit 0 with decision `ready` may proceed to first execution. After a side effect, update the envelope with outcome/postcondition and rerun before marking the action committed.

## Workflow
Accumulate partial fragments → observe terminal event → freeze identity/arguments → schema validate → authorize → assign idempotency/integrity hash → execute → verify postcondition or reconcile unknown state → independently verify regression cases.

## Metrics
Incomplete executions, invalid executions, unauthorized executions, duplicate side effects, unknown-outcome reconciliation coverage, and false blocks of valid complete calls.

## Verification
Run `python3 -m pytest tests/test_tool_call_gate.py` when pytest is available. Integration tests must additionally force real stream interruption at several fragment boundaries and prove that the executor receives no call until completion.

## Safety
Never substitute `{}` or guessed defaults for malformed arguments. Never treat protocol-history repair as proof an external action failed. Never blind-retry side effects whose outcome is unknown. Production/destructive verification must use mocks, sandboxes, or explicit human approval.

## Failure handling
Detection: gate returns partial/reconcile/deny/invalid or a lifecycle invariant is violated. Evidence: preserve sanitized ordered stream and execution records. Retry: maximum two model repair attempts for invalid calls; transport retries only when execution is proven not started. Fallback: disable unattended high-impact tool use. Escalation: human/security/platform owner. Stop condition: external state cannot be reconciled or integrity evidence is unavailable.

## Definition of Done
**Implemented:** partial/complete/executing/unknown/committed states are enforced and all side-effect paths pass through the gate. **Measured:** baseline and adversarial execution outcomes are recorded. **Verified:** zero tested partial/invalid executions, zero duplicate side effects, all unknown outcomes reconcile before retry, valid calls remain usable, and the independent verifier reports no blocking path.

## Customization
Map provider-specific terminal/finish events into the common envelope, add tool-specific postcondition checks, and integrate API-native idempotency receipts. Preserve the invariant that model intent alone never upgrades a partial or unknown call into an executable/committed state.

## Schema example

`examples/tool-call-envelope.example.json` is a synthetic instance of `schemas/tool-call-envelope.schema.json` for contract smoke tests. It contains no production data and demonstrates shape only; validate it with the package's documented checker or a Draft 2020-12 JSON Schema validator before adapting it.
