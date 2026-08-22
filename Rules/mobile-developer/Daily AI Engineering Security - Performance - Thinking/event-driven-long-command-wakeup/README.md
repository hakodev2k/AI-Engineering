# Event-Driven Long Command Wakeup

## Category
Performance

## Problem
Agent runtimes can turn a long-running command into a sequence of full model turns whose only purpose is asking whether the process has finished. This wastes tokens, quota, latency, and concurrency while adding no useful reasoning.

## Evidence
`evidence/research.md` documents current sources. The strongest recent signal is Codex issue #38495 (2026-08-14), which reports a code-mode execution path producing tens of millions of input tokens through repeated wait/status polling. Issues #32188 and #29865 independently request event-driven/background wakeup mechanisms, while #37299 and #35259 measure the same full-context polling cost in related wait/status orchestration.

## Existing approach
Fixed model polling, longer polling intervals, monitoring subagents, permanently open tool calls, or manual interruption.

## Existing limitations
Each model poll may resend the accumulated context. Longer intervals reduce frequency but not architecture-level waste. Monitoring subagents consume their own context/capacity. Silent healthy processes and hung processes can look identical without runtime lifecycle events.

## Proposed improvement
Use authoritative process completion/output events to wake the orchestration layer without a model timer. Where events are unavailable, place deterministic waiting outside the model loop with exponential backoff, no-progress limits, poll limits, estimated token budgets, terminal-state correlation, and stricter post-deliverable cleanup limits.

## Architecture
1. `skills/long-command-baseline.md` measures wait overhead and identifies the root cause.
2. `rules/wait-loop-rules.md` defines observable performance/correctness invariants.
3. `scripts/wait_budget_guard.py` implements bounded deterministic fallback decisions.
4. `hooks/pre-wait-budget-check.md` blocks an unbounded next poll.
5. `workflows/measure-eventify-verify.md` defines the baseline → diagnosis → implementation → measurement → review loop.
6. `subagents/wait-performance-reviewer.md` provides independent verification.
7. `config/wait-policy.json` contains safe bounded defaults.

## Package tree
```text
README.md
config/wait-policy.json
evidence/research.md
hooks/pre-wait-budget-check.md
rules/wait-loop-rules.md
scripts/wait_budget_guard.py
skills/long-command-baseline.md
subagents/wait-performance-reviewer.md
workflows/measure-eventify-verify.md
```

## Installation
Requires Python 3.10+ for the deterministic watchdog. No third-party Python dependencies are required.

## Configuration
Tune `config/wait-policy.json` based on measured command-duration classes. Keep maximum poll/no-progress/token budgets finite. Destructive cancellation remains disabled by default and requires explicit approval when configured as dangerous.

## Usage
Create `wait-state.json` with a process identifier, status, event flags, poll counts, last wait interval, token estimate, and whether the deliverable is already complete. Then run:
```bash
python scripts/wait_budget_guard.py wait-state.json --policy config/wait-policy.json --strict
```
Exit codes: `0` deterministic action allowed, `2` invalid state/configuration, `3` automatic polling budget exhausted.

The preferred production integration does not repeatedly invoke this script from the model. The runtime/orchestrator should call it or implement the same deterministic state machine outside the LLM turn loop.

## Workflow
Observe → measure baseline → diagnose event availability → form hypothesis → implement event wakeup or deterministic fallback → measure again → compare cost and detection latency → independent verification.

Optimization retries are bounded to two materially different attempts per hypothesis. Transient benchmark noise may be rerun once.

## Metrics
Measure wait-only model turns per command, estimated wait tokens, percentage of waiting handled without model re-entry, p50/p95 completion-detection delay, total task latency, false-hang escalation, post-deliverable polls, and concurrency-slot occupancy.

## Verification
Use at least five cases: fast completion, silent healthy long command, progressive long command, genuinely hung command, and cleanup after user deliverable completion. Verify terminal events stop future polling and required output/exit status is collected exactly once.

Never claim improvement from lower token traffic alone; report completion-detection latency and correctness alongside it.

## Safety
Do not treat silence as proof of a hang. Do not discard required command output to save context. Do not automatically cancel destructive/irreversible work when policy requires human approval. Budget exhaustion means reconcile/escalate, not pretend the command succeeded.

## Failure handling
Detection: watchdog budget block, stale process state, missing/mis-correlated completion event, benchmark regression, or reviewer failure. Evidence: preserve structured timing/state/token metadata. Retry: at most two materially different changes. Fallback: bounded backoff polling outside the model loop. Escalation: runtime owner/human for ambiguous process state. Stop condition: lost output, unsafe cancellation, event-correlation failure, or retry exhaustion.

## Definition of Done
**Implemented:** authoritative event wakeup or bounded deterministic wait controller is integrated.

**Measured:** before/after wait-turn, token, latency, and correctness metrics exist on comparable workloads.

**Verified:** independent reviewer reproduces the improvement, all loops are bounded, no terminal result/output is missed, and no blocking issue remains.

## Customization
Add command-duration profiles, runtime-specific completion events, output-progress classifiers, and measured token-cost models. Preserve the invariant that deterministic waiting should not require repeated full-context model inference.
