# Terminal Stream Retry Classification Guard

## Topic
Prevent retry amplification when model-stream terminal states or transport stalls are misclassified.

## Category
Performance

## Problem
A logically terminal model event can be retried as though the stream transport failed, and a stalled WebSocket can consume repeated long timeout windows before fallback. This multiplies latency, model calls, and token/cost exposure while making an agent appear active without useful progress.

## Evidence
See `evidence/research.md`. Current signals include OpenAI Codex issues #38831 (terminal `response.incomplete` retried), #38638 (300-second WebSocket stalls repeated before HTTPS fallback), and #39512 (>5-hour, >5× baseline run with excessive token use and zero original bugs fixed).

## Existing approach
Automatic SDK retries, exponential backoff, fixed transport timeouts, eventual transport fallback, and agent-level watchdogs.

## Existing limitations
Different layers can independently retry; application terminal semantics may be collapsed into generic stream errors; count-only budgets can still allow very large cumulative waits; and fallback can occur too late.

## Proposed improvement
Normalize outcomes once, centralize retry eligibility, enforce attempt plus wall-clock budgets, stop on semantic terminal events, and fallback based on classified transport evidence. Always measure before and after.

## Architecture
- `evidence/research.md` — public evidence, current approaches, gaps and root causes.
- `skills/retry-trace-analysis.md` — baseline/diagnosis procedure.
- `rules/retry-policy.md` — enforceable retry invariants.
- `subagents/performance-verifier.md` — independent metric/regression reviewer.
- `workflows/measure-classify-optimize-verify.md` — bounded Measure → Diagnose → Optimize loop.
- `hooks/retry-decision-gate.md` — centralized runtime decision hook.
- `scripts/retry_classifier.py` — dependency-free deterministic classifier.
- `tests/test_retry_classifier.py` — regression tests for terminal, transient, fallback and budget behavior.

## Actual package tree
```text
terminal-stream-retry-classification-guard/
├── README.md
├── evidence/research.md
├── hooks/retry-decision-gate.md
├── rules/retry-policy.md
├── scripts/retry_classifier.py
├── skills/retry-trace-analysis.md
├── subagents/performance-verifier.md
├── tests/test_retry_classifier.py
└── workflows/measure-classify-optimize-verify.md
```

## Installation
Python 3.9+ only. Integrate the classifier at the single point where normalized stream/transport outcomes are converted into retry/fallback actions.

## Configuration
Default reference budgets are 3 attempts and 45 seconds cumulative retry wait. Tune using representative traces, not intuition. Keep semantic terminal states non-retryable.

## Usage
```bash
python scripts/retry_classifier.py response.incomplete --attempt 1
python scripts/retry_classifier.py transport_timeout --attempt 3 --max-attempts 3 --transport websocket
python -m unittest tests/test_retry_classifier.py
```

## Workflow
Follow `workflows/measure-classify-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → re-evaluate at most twice → independent verification.

## Metrics
Required: attempts per logical turn, cumulative retry wait, p50/p95/p99 end-to-end latency, transport fallback time, terminal-state retry count, successful completion rate. Also track tokens per successful task when available.

## Verification
**Implemented:** centralized classifier, policy, hook, workflow and tests exist. **Measured:** host captures baseline and post-change metrics on the same representative workload. **Verified:** tests pass; terminal events produce no retry; attempts/wait stay bounded; p95 latency or retry count improves or stays no worse; and completion/correctness does not materially regress.

## Safety
Never obtain performance gains by skipping required security checks, approvals, correctness validation, or by discarding failed samples. Unknown outcomes default to STOP rather than blind retry.

## Failure handling
Detection: classifier error, exhausted budget, missing baseline, metric regression or verifier BLOCK. Evidence: preserve logical-turn traces and aggregate metrics. Retry policy: at most two policy revisions per investigation. Fallback: restore previous known policy or switch transport only when classifier permits. Escalation: protocol/transport owner for ambiguous semantics. Stop condition: evidence cannot distinguish terminal application state from transient failure or correctness regresses.

## Definition of Done
Current evidence documented; representative baseline captured; limitation/root cause identified; one bounded policy change implemented; deterministic tests pass; before/after metrics complete; no terminal-state false retries; success/correctness preserved; independent verifier PASS; risks documented; no blocking issue remains.

## Customization
Extend normalized event names for provider-specific protocols while keeping the decision contract stable. Add tests before making a new event retryable. Use separate transport budgets only when trace evidence supports different behavior.
