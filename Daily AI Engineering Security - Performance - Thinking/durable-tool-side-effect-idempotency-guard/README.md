# Durable Tool Side-Effect Idempotency Guard

**Category:** Thinking

## Problem
Durable agents can retry or resume a tool after failures where the external side effect may already have committed. Without a stable operation identity and durable outcome ledger, the same authorized action can be executed twice.

## Evidence
See `evidence/research.md`. Current public signals include LangGraph's July 28, 2026 durable idempotency proposal, recent checkpoint/resume correctness reports, and current durable-state work in OpenAI Agents SDK.

## Existing approach
Framework retries/checkpoints improve orchestration durability, provider idempotency keys help when available, and some applications store completion records.

## Existing limitations
Checkpoint success is not the same as external exactly-once execution. A timeout is ambiguous. Provider support varies, and in-memory records disappear on crashes.

## Proposed improvement
Use a stable logical operation key across all attempts, durably claim side-effecting operations before execution, reuse known successes, distinguish definitive failure from unknown outcome, and reconcile unknown outcomes before replay.

## Architecture
- `evidence/research.md` — evidence, limitations, root causes, metrics.
- `config/policy.json` — side-effect classes, high-impact policy, retry budget.
- `skills/idempotency-assessment.md` — reusable assessment procedure.
- `rules/side-effect-rules.md` — enforceable replay safety rules.
- `subagents/recovery-verifier.md` — independent verifier.
- `workflows/execute-with-durable-claim.md` — end-to-end bounded workflow.
- `hooks/pre-tool-idempotency.md` — pre-execution deterministic gate.
- `scripts/idempotency_gate.py` — executable decision gate.
- `tests/replay-cases.json` — representative replay scenarios.

## Installation
Requires Python 3.10+ and no third-party packages. Copy this directory into the repository that hosts the agent/tool integration. Production usage also requires a durable ledger implementation supplied by the host application.

## Configuration
Edit `config/policy.json`. Classify all write-capable tools. Keep the default fail-closed behavior for high-impact ambiguity. Provider-specific idempotency headers may be mapped by the host integration.

## Usage
Build an input JSON with workflow ID, logical action, target, canonical arguments, side-effect class, and the current ledger record, then run:

`python scripts/idempotency_gate.py request.json --policy config/policy.json`

Exit codes: 0 execute/reuse, 2 invalid input, 3 reconcile, 4 block.

The script returns the stable operation key and, for new/retryable actions, the durable claim that must be persisted before external execution.

## Workflow
Follow `workflows/execute-with-durable-claim.md`: Observe → Measure baseline → Diagnose failure windows → Form operation-key hypothesis → Claim → Execute → Record → Reconcile ambiguity → Measure again → Independent verification.

## Metrics
- Duplicate effects in replay suite.
- Stable-key coverage for side-effecting calls.
- Key reuse across retry/resume.
- Unknown-outcome reconciliation coverage.
- Unsafe replay blocks.
- Attempts per logical action.

## Verification
At minimum test: crash before external request, remote success followed by local timeout, crash after external success before local persistence, duplicate queue delivery, checkpoint resume, definitive provider rejection, and attempt-budget exhaustion. A high-impact ambiguous outcome must not automatically replay.

`tests/replay-cases.json` uses `COMPUTE_FROM_INPUT` as a fixture marker: the test harness should first run the same logical input with no record, capture the generated operation key, then substitute it into the follow-up ledger record. This deliberately verifies key stability rather than hard-coding a hash.

## Safety
Operation keys and ledger logs must not contain secrets. Existing authorization and human-approval controls remain mandatory. This package addresses replay correctness; it does not grant permission to perform an action.

## Failure handling
Detection: nonzero gate exit, ledger persistence failure, key mismatch, attempt exhaustion, or unknown external result. Evidence: ledger state and external reconciliation record. Retry: only definitive failures, maximum from policy. Fallback: reconcile read-only. Escalation: human approval for unresolved high-impact ambiguity. Stop: success/reuse, bounded definitive failure, or unresolved blocked ambiguity.

## Definition of Done
**Implemented:** all scoped side-effect tools pass through the stable-key gate and durable ledger.

**Measured:** pre/post replay metrics are captured.

**Verified:** independent verifier confirms zero duplicate effects in required fixtures, 100% stable-key reuse across retry/resume, unknown high-impact actions do not blindly replay, and no secret material is logged.

## Customization
Add application-specific effect classes, canonicalization rules, ledger adapters, and provider reconciliation steps. Do not customize away the invariant that ambiguous external outcomes require reconciliation before replay.
