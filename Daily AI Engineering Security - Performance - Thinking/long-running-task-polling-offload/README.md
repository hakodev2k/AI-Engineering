# Long-Running Task Polling Offload

**Category:** Performance / Token

## Problem
Long-running builds, MCP jobs, terminal commands, and child agents are often monitored through repeated model turns that do nothing except wait or check status. Recent Codex and OpenClaw reports show this can consume substantial token volume and sometimes millions of tokens without adding reasoning value.

## Evidence
See `evidence/research.md` for current public evidence, including OpenAI Codex issues #35259 and #38495, OpenClaw #16807, and a runtime-side polling implementation pattern from `mcp-sentinel`.

## Existing approach and limitation
Fixed wait calls, sleep/poll loops, or short tool timeouts keep the LLM in the control loop. Exponential backoff helps but still re-enters the model. The improvement is to treat waiting as deterministic orchestration and wake the model only for a terminal or materially changed state.

## Proposed improvement
A bounded wait broker parks model reasoning, polls a read-only provider with exponential backoff/jitter, enforces deadlines and result-size limits, and emits one terminal event.

## Architecture
- `evidence/research.md`
- `config/policy.json`
- `scripts/wait_broker.py`
- `skills/polling-offload.md`
- `rules/polling-rules.md`
- `subagents/benchmark-agent.md`
- `workflows/offload-and-verify.md`
- `hooks/pre-wait-check.md`
- `tests/test_wait_broker.py`

## Installation
Python 3.10+; no third-party packages. Create a provider command that accepts the durable handle as its final argument and emits one JSON object with `status` and optional `result`.

## Configuration
Edit `config/policy.json` for provider-appropriate intervals and total deadline. Do not remove bounds. Prefer push completion when supported.

## Usage
`python scripts/wait_broker.py --policy config/policy.json --handle <handle> -- <provider-command>`

## Workflow
Measure current wait turns/tokens first. Validate read-only status semantics and a durable handle. Offload the wait. Re-run equivalent success/failure/cancel/timeout fixtures. Have the benchmark agent independently compare correctness and performance.

## Metrics
Model wait turns/task, wait tokens/task, runtime polls/task, p50/p95 completion-detection lag, timeout rate, cancellation latency, terminal-state correctness.

## Verification
Target >=80% reduction in model wait turns on long-running fixtures with no terminal-state correctness regression. Claims are valid only after baseline and post-change telemetry are captured.

## Safety
Status providers must be read-only. Do not broaden tool permissions. Preserve caller deadlines. Bound result size. Never hide timeout/failure behind unlimited retries.

## Failure handling
Detection: provider error, invalid state, timeout, cancellation failure, or correctness mismatch. Maximum integration retries: 1. Fallback: prior bounded wait mechanism. Escalate when provider semantics cannot guarantee safe read-only status checks.

## Definition of Done
**Implemented:** broker and integration path exist. **Measured:** baseline and candidate metrics captured. **Verified:** success/failure/cancel/timeout fixtures match underlying state, target wait-turn reduction is measured, and no security boundary was weakened.

## Customization
Adapters may replace the subprocess provider with HTTP, queue, CI, Kubernetes, or agent-runtime status APIs, but the same bounds, cancellation, observability, and independent verification rules should remain.
