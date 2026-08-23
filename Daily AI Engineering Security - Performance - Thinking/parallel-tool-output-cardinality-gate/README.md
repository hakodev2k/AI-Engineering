# Parallel Tool Output Cardinality Gate

## Topic
Structural completeness for parallel agent tool calls.

## Category
Thinking / Performance

## Problem
Parallel tool orchestration can lose, duplicate, or misclassify terminal results across structured-output, approval, streaming, guardrail, cancellation, persistence, and resume paths. The next model request may then contain unmatched call IDs or an incomplete execution history.

## Evidence
See `evidence/research.md` for 2026 public reports from LangChainJS and OpenAI Agents Python that demonstrate missing-result failures in different orchestration paths.

## Existing approach
Frameworks track tool calls and outputs internally and providers often reject malformed turn histories. Some systems reduce risk by serializing execution.

## Existing limitations
Late provider validation detects damage after state has already diverged. Parallel lifecycle paths can disagree about whether an output was generated, persisted, sent, rejected, or already acknowledged. Serializing all tools gives up throughput without proving correctness.

## Proposed improvement
Maintain a turn-scoped ledger of every emitted call ID. Require exactly one explicit terminal disposition per non-deferred call, keep generated/persisted/sent states separate, reconcile once after resume, and block the next model request when cardinality is incomplete.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gap, and root causes.
- `skills/verify-tool-output-cardinality.md` — reusable verification procedure.
- `rules/tool-cardinality-rules.md` — enforceable lifecycle invariants.
- `workflows/reconcile-before-next-turn.md` — bounded orchestration workflow.
- `scripts/check_cardinality.py` — deterministic preflight validator.
- `tests/test_check_cardinality.py` — structural regression tests.

## Installation
Python 3.10+ is required for the validator. Tests use `pytest`.

```bash
python -m pip install pytest
pytest tests/test_check_cardinality.py
```

## Usage
Write the current turn ledger to JSON and run:

```bash
python scripts/check_cardinality.py ledger.json
```

Exit codes: `0` complete, `2` invalid input, `3` block.

Example ledger:

```json
{
  "calls": [
    {
      "call_id": "call-a",
      "terminal_dispositions": ["success"],
      "persisted": true,
      "sent": true
    },
    {
      "call_id": "call-b",
      "terminal_dispositions": ["rejected"],
      "rejected": true,
      "persisted": true,
      "sent": true
    }
  ]
}
```

## Workflow
Observe emitted calls → register ledger → execute safely in parallel → terminalize each call → persist with explicit state → reconcile resume/approval paths → preflight cardinality → continue only when complete → measure against baseline.

## Metrics
- Orphaned call rate.
- Duplicate terminal disposition rate.
- Provider errors caused by missing tool results.
- Reconciliation count and success rate.
- Verification latency.
- Parallel throughput and total turn latency.

## Verification
Run fixtures for normal parallel success, mixed success/error, mixed approval/immediate execution, rejected calls, guardrail termination, resume hydration, and multiple structured-output calls. Production acceptance requires zero orphaned or duplicate terminal states in the regression corpus.

## Safety
The gate MUST NOT fabricate output payloads or relabel rejection/cancellation as success. It preserves concurrency when state is complete and blocks continuation when the conversation contract is structurally unsafe.

## Failure handling
Detect incomplete or conflicting ledgers before the next model request. Permit exactly one state-reconciliation pass. If state is still incomplete, preserve evidence and block/escalate rather than sending a malformed turn or repeatedly retrying.

## Definition of Done
**Implemented:** all emitted calls are registered and the preflight gate runs before the next model request.  
**Measured:** baseline/post-change orphan rate, provider errors, throughput, and latency are recorded.  
**Verified:** regression fixtures pass, orphan and duplicate rates are zero, no rejected call is marked successful, and the next request is never sent with required tool results missing.

## Customization
Map framework-specific lifecycle events into the generic fields used by the validator. Keep the core invariant stable: expected call IDs and terminal dispositions must reconcile exactly before continuation.
