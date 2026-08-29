# Progress-Aware Agent Loop Guard

**Category:** Performance  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Tool-using agents can make many repeated or cyclic calls without producing new state. Step/recursion limits stop runs eventually, but often only after unnecessary model calls, tool calls, latency, and token spend. Runtime regressions can also replay a failed tool call even when the model attempted a different action.

## Evidence
See `evidence/research.md`. Current signals include LangChain issue #36139 requesting progress-aware termination because count-only limits do not detect stuck states, LangGraph issue #6731 showing an agent looping until the recursion limit, OpenClaw issue #73781 reporting runtime replay loops after tool failure, and Hermes Agent issue #66820 reporting 148 tool calls with no graceful stop in a MoA loop.

## Existing approach
Common controls are `max_iterations`, recursion limits, per-tool call caps, timeouts, and prompt instructions. These are useful backstops but do not distinguish productive long runs from non-productive repetition.

## Remaining limitation
Counting calls alone can stop a legitimate long task too early while allowing a pathological loop to burn most of its budget. Prompt-only stop instructions do not help when the runtime itself replays calls.

## Proposed improvement
A deterministic guard fingerprints tool name, canonical arguments, outcome signature, and optional state fingerprint. It detects exact repeat streaks, short cycles, and state stagnation, while preserving a hard total-step ceiling as a final backstop.

## Package tree
```text
README.md
evidence/research.md
config/guard.example.json
skills/no-progress-diagnosis.md
rules/progress-termination-rules.md
subagents/performance-investigator.md
subagents/verification-agent.md
workflows/measure-diagnose-guard-verify.md
hooks/post-tool-progress-check.md
scripts/progress_guard.py
tests/test_progress_guard.py
```

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/progress_guard.py trace.jsonl --config config/guard.example.json --json-out report.json
python -m unittest tests/test_progress_guard.py
```
Each JSONL row represents one tool step and may include `tool`, `args`, `result`, `error`, `state_fingerprint`, `latency_ms`, and `tokens`.

## Workflow
Use `workflows/measure-diagnose-guard-verify.md`: **Observe → Measure baseline → Diagnose → Hypothesize → Install guard → Measure again → Verify**. Optimization retries are bounded to two.

## Metrics
- tool calls/task and repeated calls/task;
- model calls/task;
- input/output tokens/task;
- wall-clock latency p50/p95;
- loop-termination detection precision on labeled traces;
- false-positive termination rate on successful long tasks;
- successful-task rate and result-quality regression rate.

## Verification states
**Implemented:** guard is installed and deterministic tests pass.  
**Measured:** baseline and guarded traces are collected on the same workload.  
**Verified:** repeated calls/tokens/latency fall without an unacceptable task-success regression, and known loop fixtures terminate before the hard ceiling.

## Safety
The guard MUST NOT retry side-effecting tools automatically. It MUST preserve hard resource ceilings. A loop stop is not equivalent to task success; callers must surface `no_progress_detected` distinctly from successful completion.

## Failure handling
If the guard fires incorrectly, retain the trace, restore the last known-good thresholds, and retry threshold tuning at most twice. If no configuration meets both loop-detection and success-rate targets, disable the new guard for production and escalate with evidence rather than weakening correctness criteria.

## Definition of Done
Evidence documented; baseline captured; loop signature identified; guard implemented; tests pass; before/after metrics recorded; false positives evaluated; independent verifier signs off; no side-effecting tool is duplicated by recovery logic; no blocking issue remains.

## Customization
Tune thresholds in `config/guard.example.json`. Extend the adapter that emits JSONL traces rather than changing the fingerprint semantics, so reports remain comparable across agent frameworks.
