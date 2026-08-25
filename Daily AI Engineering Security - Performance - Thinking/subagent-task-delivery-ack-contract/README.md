# Subagent Task Delivery ACK Contract

**Category:** Thinking  
**Status:** Implemented reusable contract with deterministic trace verification.

## Problem
Multi-agent orchestrators can report a successful spawn or message send even when the child never receives the delegated task, receives an empty payload, or starts acting from inherited context before task delivery is confirmed. The parent then mistakes process existence for successful delegation.

## Evidence
See `evidence/research.md`. Fresh August 2026 reports from Codex and Claude Code show initial task payloads, follow-up messages, and teammate result channels being silently dropped or stranded while APIs still report success.

## Existing approach and limitation
Spawn-success responses, inbox writes, idle notifications, and process liveness prove transport-side activity but not recipient consumption. Polling child status does not prove the child received the intended task.

## Proposed improvement
Use an application-level delegation handshake: parent computes a task hash; child must emit a matching delivery acknowledgement before performing task-specific actions; parent verifies ACK within a bounded deadline. Follow-up instructions use monotonically increasing message sequence numbers and ACKs. Missing ACK triggers bounded retry or child cancellation/re-spawn, never silent continuation.

## Architecture
- `skills/delegation-handshake.md` — reusable delegation procedure.
- `rules/task-delivery-rules.md` — observable invariants.
- `subagents/delegation-verifier.md` — independent verifier role.
- `workflows/spawn-ack-execute.md` — bounded spawn/recovery workflow.
- `hooks/pre-child-action-gate.md` — deterministic gate contract.
- `scripts/delivery_guard.py` — JSONL validator.
- `tests/test_delivery_guard.py` — regression tests.
- `evidence/research.md` — public evidence and root-cause analysis.

## Installation
Python 3.10+; no third-party dependencies.

## Usage
```bash
python3 scripts/delivery_guard.py delegation-trace.jsonl
python3 -m unittest tests/test_delivery_guard.py
```

## Trace contract
Records require `agent_id`, `event`, `ts_ms`. Delegation events also carry `seq` and `task_hash`. Recognized events: `spawn_requested`, `task_delivered`, `task_acknowledged`, `first_action`, `followup_delivered`, `followup_acknowledged`, `completed`.

## Metrics
ACK success rate, delivery-to-ACK latency, action-before-ACK violations, hash mismatch count, follow-up ACK rate, retries per delegation, and abandoned children.

## Verification
**Implemented:** protocol, validator, rules, workflow, tests.  
**Measured:** runtime emits delivery/ACK trace with bounded latency.  
**Verified:** no task-specific action occurs before a matching ACK; tests pass; independent verifier confirms the child executed the acknowledged task version.

## Safety
A child with no valid task ACK is treated as unauthorized to perform task-specific mutations. Cancellation/re-spawn preserves parent permission limits; retries never broaden tools or sandbox access.

## Failure handling
Detect missing/mismatched ACK deterministically. Retry delivery once; if still absent, cancel the child and optionally re-spawn once. After the second failed child, stop delegation and fall back to parent execution or human-visible failure. Never loop indefinitely.

## Definition of Done
Evidence documented; delivery contract implemented; ACK timing measured; tests pass; action-before-ACK blocked; follow-ups versioned; bounded recovery tested; independent verification complete; no permission boundary widened.

## Customization
Adapters may map native agent events to this schema. They MUST preserve task hash, sequence, recipient identity, and event order.