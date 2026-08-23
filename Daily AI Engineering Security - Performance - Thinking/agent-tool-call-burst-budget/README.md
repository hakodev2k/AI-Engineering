# Agent Tool-Call Burst Budget

**Category:** Performance

## Problem
Tool-using agents can issue expensive bursts of different calls that evade identical-call loop detectors and waste tokens, latency, and external API capacity before coarse turn limits intervene.

## Evidence
See `evidence/research.md`. Current signals include OpenClaw #47175, OpenAI Codex #31935, and Vercel AI #17606.

## Existing approach and limitations
Common controls are max turns, duplicate-call detection, provider rate limits, and manual polling rules. They either act too late, miss heterogeneous call bursts, protect providers rather than task efficiency, or risk breaking productive fan-out.

## Proposed improvement
Apply a deterministic sliding-window resource budget before each tool call. Track total calls, poll/retry calls, estimated input tokens, and bounded approved fan-out. Keep framework-native hard limits and all security controls intact.

## Architecture
```text
agent runtime -> tool-event classifier -> pre-tool hook -> burst_budget.py
                                              |-> allow -> tool
                                              |-> defer -> cooldown/replan
                                              `-> block -> stop/escalate
trace collector -> baseline analysis -> verifier -> final decision
```

## Package tree
```text
agent-tool-call-burst-budget/
├── README.md
├── evidence/research.md
├── config/budget.json
├── skills/baseline-and-budget-analysis.md
├── rules/burst-budget-rules.md
├── subagents/performance-verifier.md
├── workflows/measure-optimize-verify.md
├── hooks/pre-tool-budget-check.md
├── scripts/burst_budget.py
└── tests/test_burst_budget.py
```

## Installation
Requires Python 3.10+. No third-party runtime dependency is needed. For tests install `pytest` in the host environment.

## Configuration
Tune `config/budget.json` from representative baseline traces. Do not copy default thresholds into production without measurement.

## Usage
Provide a JSONL trace with `timestamp`, `tool`, `class`, `estimated_input_tokens`, and optional `approved_fanout`, then run:

`python scripts/burst_budget.py current-turn.jsonl --policy config/budget.json --strict`

Integrate it through `hooks/pre-tool-budget-check.md`.

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → bounded re-evaluation → independent verification.

## Metrics
Calls/turn, calls/minute, poll/retry share, estimated input tokens/task, external API calls/task, time to first useful result, p50/p95 latency, task success, false-positive blocks.

## Verification
Run `pytest tests/test_burst_budget.py`, replay representative baseline/candidate fixtures at least three times each, and have `subagents/performance-verifier.md` reproduce the measurements.

## Safety
The package MUST NOT disable approval, sandbox, secret, network, or destructive-action controls. Fan-out exceptions remain bounded. A hard global turn limit remains mandatory.

## Failure handling
Detection: budget decision, invalid configuration, correctness regression, or false-positive block. Evidence: preserve trace and counters. Retry: at most two tuning attempts. Fallback: restore previous configuration. Escalation: runtime owner. Stop: verification success, exhausted retries, or any security/correctness regression.

## Status semantics
- **Implemented:** gate is integrated and deterministic tests pass.
- **Measured:** before/after metrics exist on representative fixtures.
- **Verified:** an independent verifier reproduces improvement with no critical regression.

## Definition of Done
Evidence documented; baseline captured; limits justified; implementation integrated; tests pass; metrics improve; task success is equal or better; zero critical false-positive blocks; security controls unchanged; verifier marks the package Verified.

## Customization
Add task classes and narrowly scoped fan-out allowances only when traces demonstrate legitimate need. Keep the general budget conservative and measurable.
