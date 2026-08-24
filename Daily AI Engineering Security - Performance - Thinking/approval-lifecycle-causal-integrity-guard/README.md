# Approval Lifecycle Causal Integrity Guard

**Category:** Thinking

## Problem
Approval-gated agents can confuse human wait, execution, rejection, interruption, and failure. That ambiguity is not cosmetic: it can create false performance diagnoses, incorrect retries, unsupported implementation changes, or execution after a rejection.

## Evidence
Current evidence and source links are in `evidence/research.md`. The package is motivated by current Codex and LangGraph/LangChain reports where approval wait was interpreted as tool latency, interrupts became tool errors, and rejected calls could retain executable intent.

## Existing approach and limitation
HITL frameworks provide pauses, checkpoints, approval middleware, and tool errors, but those primitives do not by themselves guarantee that every downstream trace and agent-facing result preserves causal lifecycle semantics.

## Proposed improvement
Treat approval lifecycle as a first-class state machine and deterministically audit it before using tool timing or status as reasoning evidence.

## Architecture
```text
approval-lifecycle-causal-integrity-guard/
├── README.md
├── evidence/research.md
├── hooks/approval-trace-gate.md
├── rules/approval-state-semantics.md
├── scripts/audit_approval_trace.py
├── skills/approval-lifecycle-diagnosis.md
├── subagents/causal-reviewer.md
├── tests/test_audit_approval_trace.py
└── workflows/observe-diagnose-remediate.md
```

## Installation
Requires Python 3.9+ and no third-party dependencies. Copy the directory into the host repository or automation workspace.

## Trace format
One JSON object per line with `call_id`, `state`, and `ts_ms`. Optional fields include `tool`, `message`, `duration_ms`, and `duration_kind`.

## Usage
`python scripts/audit_approval_trace.py trace.jsonl --pretty`

Exit codes: `0` valid; `1` invalid input/runtime error; `2` blocking lifecycle violation.

## Workflow
Follow `workflows/observe-diagnose-remediate.md`. Baseline immediate approval against delayed approval, diagnose only from execution-only timing, make a bounded fix, measure again, and require independent causal review.

## Metrics
Invalid transitions, approval-time misattribution, rejected-then-executed events, interrupt-as-error events, execution-only timing coverage, and unsupported causal conclusions.

## Verification
Run `python -m pytest tests/test_audit_approval_trace.py` when pytest is available, or import/run the tests in the host test runner. The deterministic script itself has no third-party dependencies.

A successful delayed-approval test MUST show higher end-to-end latency without inflating derived execution latency.

## Safety
The package never auto-approves an action. Rejection is terminal for the current call ID. Audit failure blocks performance-driven changes derived from the affected trace.

## Failure handling
Detection: nonzero auditor result. Evidence: emitted violation records. Retry: maximum two instrumentation/fix iterations. Fallback: revert speculative change and preserve trace. Escalation: runtime/framework owner. Stop: when evidence cannot be made unambiguous without weakening HITL controls.

## Definition of Done
- **Implemented:** explicit lifecycle semantics and trace fields exist.
- **Measured:** controlled immediate/delayed approval traces captured.
- **Verified:** zero blocking audit violations, tests pass, execution-only timing supports the conclusion, and an independent reviewer accepts the result.

## Customization
Adapters may translate framework-specific events into the canonical states, but MUST preserve immutable call IDs, terminal rejection, interrupt semantics, and separate approval/execution intervals.
