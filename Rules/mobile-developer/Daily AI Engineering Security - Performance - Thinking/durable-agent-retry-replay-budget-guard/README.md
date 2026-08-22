# Durable Agent Retry Replay Budget Guard

## Topic
Replay-aware recovery for durable and long-running AI-agent failures.

## Category
Performance

## Problem
A retryable error can trigger full-turn or identical-request replay that repeats expensive model and tool work without progress. Recent reports show loops lasting tens of minutes and consuming tens of millions of tokens.

## Evidence
`evidence/research.md` documents independent 2026 reports from Vercel Eve, OpenCode, and Hermes Agent plus current OpenAI efficiency guidance. The reports show full-turn replay after stream errors, indefinite repeated final calls, and unchanged empty-response retries.

## Existing approach
Typical controls are exponential backoff, fixed retry counts, workflow-step retry, provider SDK retries, parent timeouts, and prompt caching.

## Existing limitations
Attempt counts do not bound token/tool/time amplification. Backoff lowers request frequency but can still repeat entire expensive turns. Durable systems can resume from stale step boundaries instead of meaningful checkpoints. Identical requests may be retried without causal change. Prompt caching lowers repeated-prefix compute but does not correct replay semantics.

## Proposed improvement
Track request fingerprints, committed progress/checkpoints, replayed tokens, post-failure tool calls, and wall time. Gate every expensive retry. Prefer newest-safe-checkpoint resume, permit only bounded identical replays, require changed evidence/state for repeated deterministic failures, and escalate or stop when any budget is exhausted.

## Architecture
The package combines current evidence, configurable multi-dimensional budgets, a deterministic retry gate, a replay-analysis skill, enforceable retry rules, independent verifier, a bounded measure/diagnose/recover workflow, and a blocking pre-retry hook.

## Package tree
```text
durable-agent-retry-replay-budget-guard/
├── README.md
├── config/
│   └── retry-budget.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-retry-budget-check.md
├── rules/
│   └── retry-policy.md
├── scripts/
│   └── retry_gate.py
├── skills/
│   └── replay-amplification-analysis.md
├── subagents/
│   └── retry-verifier.md
└── workflows/
    └── measure-diagnose-recover.md
```

## Installation
Requires Python 3.10+; the reference gate uses only the standard library. Integrate the same counters and decisions into the runtime's actual retry path.

## Configuration
`config/retry-budget.json` defaults to 4 attempts, one identical-request retry, two no-progress retries, 100,000 replayed tokens, 20 post-failure tool calls, and 900 post-failure seconds. Tune from measured workloads, not by raising budgets after failures.

## Usage
Prepare an envelope such as:
```json
{
  "request_fingerprint": "sha256:abc",
  "previous_request_fingerprint": "sha256:abc",
  "checkpoint_id": "cp-17",
  "progress_changed": false,
  "request_changed": false,
  "attempts": 2,
  "identical_request_retries": 1,
  "no_progress_retries": 1,
  "replayed_tokens": 42000,
  "post_failure_tool_calls": 4,
  "post_failure_wall_seconds": 160,
  "full_turn_replay": false
}
```
Run:
```bash
python scripts/retry_gate.py retry.json --config config/retry-budget.json
```
Exit `0` allows bounded retry/resume, `2` is invalid input/config, `3` requires escalation/reconciliation, and `4` stops automatic retry.

## Workflow
Follow `workflows/measure-diagnose-recover.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → Test transient recovery → Independent verification. Maximum two remediation cycles.

## Metrics
Measure replay amplification ratio, duplicate fingerprint count, no-progress retries, post-failure tokens/tool calls/wall time, checkpoint-resume ratio, recovery success rate, and false-stop rate.

## Verification
Use two fixtures: a repeated deterministic failure with unchanged input, and a genuinely transient failure that succeeds on a later attempt. The first must stop/escalate within budget; the second must recover. Verify full-turn replay never bypasses a newer safe checkpoint.

## Safety
Do not log secrets or unnecessary prompt contents when calculating fingerprints. Do not weaken security, correctness, approval, or validation checks to reduce runtime. Budget exhaustion is a control signal, not permission to silently increase the budget.

## Failure handling
Detection: budget gate, duplicate fingerprint, or no-progress threshold. Evidence: sanitized trace plus counters. Retry: bounded by configured budgets and at most two implementation remediation cycles. Fallback: checkpoint resume, changed request/route based on evidence, or human escalation. Stop: on any hard budget, uncertain checkpoint integrity, or repeated deterministic failure without causal change.

## Definition of Done
**Implemented:** pre-retry gate and checkpoint-aware policy are wired into the expensive retry path. **Measured:** baseline and after-change replay metrics are captured. **Verified:** deterministic replay is bounded, transient recovery still works, metrics improve, and independent verification passes.

## Customization
Adjust budgets per workload class using measured cost distributions. Add failure-specific classifiers only when they are observable and testable; avoid broad labels such as "retryable" without evidence that a new attempt can change the outcome.
