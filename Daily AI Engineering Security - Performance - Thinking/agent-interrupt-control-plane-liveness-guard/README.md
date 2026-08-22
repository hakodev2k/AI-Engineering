# Agent Interrupt Control-Plane Liveness Guard

## Topic
End-to-end verification that user stop/abort/corrective interrupts preempt long-running agent work, propagate to descendants, fence side effects, preserve transcript integrity, and make resume safe.

## Category
Thinking / Performance

## Problem
An agent can acknowledge a user message while continuing the old run. Interrupts may be queued behind work, fail to propagate from gateway to worker, fail to cancel tools/subagents, allow new side effects, corrupt tool-call/result ordering, or permit stale canceled work to replay after resume.

## Evidence
`evidence/research.md` documents independent 2026 reports from Hermes Agent, Agent Zero, OpenClaw, and Claude Code showing regressions or failures in interrupt delivery, effective cancellation, context prioritization, state integrity, and runaway resumption.

## Existing approach
Agent products expose `/stop`, Escape, abort APIs, busy-input modes, task cancellation, tool timeouts, or manual process termination. Some systems queue new user messages until current work finishes.

## Existing limitations
Message receipt is not cancellation effectiveness. Canceling model streaming may leave tools or child processes running. Ordinary conversation queues can delay intervention. Interruptions at persistence boundaries can create malformed transcript state, and resume logic may replay stale work.

## Proposed improvement
Make interrupt handling an observable control-plane contract. Use a monotonic interrupt epoch, priority delivery, descendant propagation, pre-side-effect cancellation fences, transcript repair, resume reconciliation, and measurable liveness deadlines. Verify with synthetic long-running fixtures and machine-readable lifecycle events.

## Architecture
- `evidence/research.md` — current evidence, root causes, gaps, goals, metrics.
- `config/policy.json` — liveness deadlines and blocking invariants.
- `skills/interrupt-liveness-analysis.md` — reusable diagnostic and verification procedure.
- `rules/control-plane-invariants.md` — enforceable runtime rules.
- `subagents/interrupt-verifier.md` — independent verification contract.
- `workflows/interrupt-recovery-verification.md` — bounded baseline/diagnose/fix/re-measure workflow.
- `hooks/post-interrupt-liveness-check.md` — blocking deterministic lifecycle hook.
- `scripts/interrupt_liveness_guard.py` — dependency-free JSONL lifecycle validator.
- `tests/test_interrupt_liveness_guard.py` — regression tests for deadlines, side-effect fencing, orphan detection, transcript repair, and resume reconciliation.

## Installation
Python 3.10+ is sufficient; the executable guard uses only the standard library. Integrate lifecycle event emission in the host runtime, then feed one fixture/run per JSONL file.

## Event contract
Each event must include:

```json
{"run_id":"r1","execution_id":"tool-1","epoch":1,"event":"descendant_started","t_ms":0}
```

Supported events are `interrupt_ingress`, `interrupt_ack`, `cancel_effective`, `descendant_started`, `descendant_terminal`, `side_effect_admitted`, `transcript_repaired`, `resume_reconciled`, and `fixture_finished`. `t_ms` should come from a monotonic clock relative to fixture start.

## Configuration
Review `config/policy.json` against product requirements. Deadline changes require measured capacity evidence; do not stretch thresholds simply to hide a regression. `maximum_post_cancel_side_effects` should remain `0` for normal agent control paths.

## Usage
From this package directory:

```bash
python3 -m unittest tests/test_interrupt_liveness_guard.py
python3 scripts/interrupt_liveness_guard.py events.jsonl --policy config/policy.json --strict
```

## Workflow
Follow `workflows/interrupt-recovery-verification.md`: Observe → Measure baseline → Diagnose first missing transition → Form hypothesis → Implement smallest fix → Measure again → Exercise persistence boundaries → Independent verify. Transient fixture retries are capped at two; remediation attempts are bounded.

## Metrics
- Interrupt ingress → acknowledgement latency.
- Interrupt ingress → effective cancellation latency.
- Descendant drain latency.
- Side effects admitted after cancel-pending.
- Orphan descendants after grace.
- Transcript repair violations.
- Resume/replay violations.

## Verification
### Implemented
A cancellation/control-plane change exists and lifecycle events are emitted.

### Measured
The same synthetic interrupt fixtures run before and after the change using the same policy.

### Verified
At least three boundary fixtures pass, no post-cancel side effect occurs, all descendants drain within grace, transcript state is structurally valid, canceled work does not replay on resume, and an independent verifier confirms the evidence.

## Safety
Use disposable fixtures for side-effect tests. Never verify interrupt handling by risking real destructive operations. The package analyzes observable lifecycle events only and never requests hidden chain-of-thought.

## Failure handling
- Missing/late acknowledgement or effective cancellation: block.
- Post-cancel side effect: block immediately.
- Dangerous descendant alive after grace: block.
- Transcript or resume integrity failure: block.
- Incomplete observation window: degraded/manual review, not success.
- Transient fixture infrastructure failure: maximum two retries.
- Repeated semantic failure: change hypothesis or escalate; do not loop indefinitely.

## Definition of Done
- Current evidence documented.
- Baseline metrics captured.
- Root cause identified with observable evidence.
- Interrupt lifecycle events cover ingress through resume reconciliation.
- Ack/effective deadlines pass.
- Zero post-cancel side effects.
- Zero orphans after grace.
- Transcript repair passes.
- Resume does not replay canceled work.
- Tests pass.
- Independent verifier confirms results.
- No blocking issue remains.

## Customization
Add framework-specific adapters that translate runtime events into this lifecycle schema. Keep the core invariants stable: priority control delivery, monotonic cancel state, descendant propagation, side-effect fencing, transcript validity, safe resume, bounded retries, and independent verification.
