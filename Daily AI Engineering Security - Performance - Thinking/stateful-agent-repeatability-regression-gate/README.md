# Stateful Agent Repeatability Regression Gate

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
A stateful agent can demonstrate a task successfully once while remaining unreliable across repeated executions of the same workflow. Recent benchmarks show a large gap between single-attempt capability and all-attempt repeatability, and many failures occur even when the agent terminates cleanly and performs valid-looking tool calls. Production teams that gate on pass@1 or final text alone therefore miss variance, wrong/missing persistent state transitions, collateral effects, and weak recovery behavior.

## Evidence
See `evidence/research.md`.

## Existing approach
Agent benchmarks increasingly execute tasks in sandboxes and validate backend state. Metrics such as pass@k and pass^k quantify discovery versus repeated reliability. Production execution systems also track terminal tool success/failure.

## Remaining limitation
These practices are not yet a standard release gate for individual agent workflows. A single successful replay can hide flakiness; tool-level success is not task-level success; aggregate pass rates can hide a subset of tasks that oscillate between success and failure; and quality regressions often appear only after repeated state resets.

## Proposed improvement
Run each consequential stateful task a bounded number of times from a clean state, evaluate executable terminal-state assertions, record collateral effects and recovery evidence, compute repeatability metrics, and block regressions deterministically. Do not inspect or request hidden chain-of-thought; reason only from observable task inputs, traces, tool outcomes, and final state.

## Package tree
- `evidence/research.md`
- `skills/repeatability-analysis.md`
- `rules/reliability-rules.md`
- `subagents/reliability-verifier.md`
- `workflows/baseline-and-diagnose.md`
- `workflows/regression-and-release.md`
- `hooks/repeatability-gate.md`
- `scripts/repeatability_gate.py`
- `config/gate.example.json`
- `examples/runs.example.jsonl`
- `tests/test_repeatability_gate.py`

## Installation
Python 3.10+; standard library only.

## Configuration
Set minimum trials per task, minimum aggregate pass rate, maximum flaky-task rate, minimum all-runs-success task rate (`pass^n` over the configured trial count), and whether any collateral effect blocks release.

## Usage
`python scripts/repeatability_gate.py config/gate.example.json examples/runs.example.jsonl`

Exit codes: 0 = release gate passes; 2 = measured reliability violates policy; 1 = invalid or incomplete evidence.

## Workflow
Observe current workflow -> establish repeated-run baseline -> classify failures from observable evidence -> form bounded hypotheses -> implement one change -> reset state and replay identical trial matrix -> compare -> independently verify -> release or stop.

## Metrics
- run pass rate
- all-runs-success task rate (`pass^n`)
- flaky-task rate
- never-pass task rate
- collateral-effect rate
- recovery-success rate
- unsupported-success rate
- trials-to-first-failure
- rework cycles

## Verification
**Implemented:** repeatability gate, workflows, rules, tests, and example schema exist.  
**Measured:** baseline and candidate execute the same task/trial matrix from reset state.  
**Verified:** configured reliability thresholds pass; no forbidden collateral effect occurs; state assertions are executable; an independent verifier checks evidence and release decision.

## Safety
Do not increase retry counts until a flaky system appears reliable. Do not discard failed trials. Do not weaken terminal-state assertions to make metrics pass. Consequential production mutations must be tested in isolated or owned environments, with human approval where required.

## Failure handling
Invalid evidence blocks the gate. Diagnosis gets at most two change-and-replay cycles. If reliability remains below threshold, revert to the known-good candidate or keep release blocked and escalate with the failure corpus.

## Definition of Done
Current evidence documented; repeated baseline captured; executable state assertions defined; candidate evaluated with identical resets/trials; metrics calculated; failures classified; no hidden failures excluded; collateral effects checked; thresholds pass; independent verification complete.