# Agent Tool-Burst Consolidation Gate

**Category:** Performance

## Problem
An agent can avoid an identical-call loop yet still thrash through many *different* tool calls in one turn: read, exec, spawn, history, retry, inspect, patch, repeat. Count-only outer turn limits and identical-loop detectors do not bound this rapid-fire burst, so each call can resend a large prompt and compound latency/token cost before the user receives any useful checkpoint.

## Evidence
2026 public issues document bursts of 12+ consecutive calls in ~30 seconds and excessive splitting of multi-step tasks into separate calls. See `evidence/research.md`.

## Existing approach and limitation
Hard max turns, identical-call detection, textual instructions, and manual cancellation help but either act too late or miss heterogeneous bursts. A simple low tool-call cap can also break legitimate workflows.

## Proposed improvement
A runtime consolidation gate tracks consecutive tool-call count, prompt-token spend, elapsed burst time, and target locality. When a configurable budget is crossed, it emits `checkpoint_required` rather than silently continuing. The next model step must summarize evidence, choose a changed plan, or request explicit continuation. Hard outer limits remain in place.

## Package tree
```text
README.md
evidence/research.md
config/burst-policy.json
rules/tool-burst-rules.md
skills/burst-baseline-and-diagnosis.md
subagents/performance-verifier.md
workflows/measure-consolidate-verify.md
hooks/post-tool-burst-check.md
scripts/tool_burst_guard.py
tests/test_tool_burst_guard.py
```

## Installation
Python 3.10+; no external packages.

## Usage
Feed one JSONL event per completed tool call:
```bash
python scripts/tool_burst_guard.py events.jsonl --policy config/burst-policy.json --strict
```
Exit 0 = continue; 3 = checkpoint/terminate required; 2 = invalid input.

## Workflow
Measure baseline burst behavior, diagnose high-cost patterns, apply checkpoint policy, then compare calls/turn, input tokens/turn, p95 turn latency, and successful completion rate.

## Metrics
- Tool calls per user-visible turn.
- Input tokens per completed task and per turn.
- Burst elapsed time.
- Checkpoint frequency and productive continuation rate.
- Completion/regression rate on legitimate long workflows.

## Verification status
**Implemented:** guard, policy, hook, tests, workflow.

**Measured:** fixture-level call/token/time thresholds.

**Verified:** only after replaying representative production traces and showing lower waste without completion-quality regression.

## Safety
The gate never retries or mutates tools itself. A checkpoint is not permission to bypass approvals or security rules. Destructive actions retain their independent approval boundary.

## Failure handling
Malformed telemetry fails safe to the host's existing hard cap. Policy evaluation retries at most once after a configuration refresh. Do not loosen budgets automatically after a checkpoint.

## Definition of Done
Baseline captured; burst thresholds justified; pathological traces checkpoint earlier; productive traces complete; before/after metrics recorded; no security/approval boundary weakened; independent performance verification passes.
