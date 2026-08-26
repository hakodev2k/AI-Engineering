# Agent Convergence Repetition Guard

**Category:** Thinking

## Problem
Long-running agents can remain active while making no meaningful progress: repeating identical tool calls, restarting the same exploration, or expanding scope faster than they close acceptance criteria. Simple step caps are too blunt, while uncapped loops can waste large token budgets.

## Evidence
See `evidence/research.md` for current 2026 signals from Vercel AI SDK, OpenAI Codex, Claude Code, and Cloudflare Agents.

## Existing approach
Frameworks commonly use fixed step caps, wall-clock limits, cost limits, no-progress timeouts, and custom stop conditions.

## Existing limitations
Step count is only a proxy for stuckness; wall-clock watchdogs can kill healthy long work; retries can restart from scratch; and “progress” is often not defined in observable task terms.

## Proposed improvement
Add a deterministic convergence gate based on observable step signatures and progress keys. It detects repeated identical tool calls, consecutive no-progress steps, and sustained scope growth without completion. It warns before stopping, uses bounded retries, and requires an explicit completion/clarification/escalation outcome.

## Architecture
- `config/policy.json` — thresholds for repeat/no-progress/scope-growth detection.
- `scripts/convergence_guard.py` — deterministic JSONL analyzer.
- `tests/test_convergence_guard.py` — stuck/healthy/regression fixtures.
- `skills/convergence-analysis.md` — evidence-driven investigation procedure.
- `rules/observable-reasoning.md` — enforceable Thinking rules.
- `subagents/convergence-reviewer.md` — independent verifier.
- `workflows/diagnose-and-recover.md` — bounded recovery workflow.
- `hooks/post-step.md` — deterministic execution hook.
- `evidence/research.md` — current evidence, approaches, gaps, roots.

## Installation
Python 3.10+; standard library only.

## Configuration
Tune thresholds in `config/policy.json` against representative traces. Do not raise limits merely to hide repeated no-progress behavior.

## Usage
`python scripts/convergence_guard.py --trace run.jsonl --policy config/policy.json`

Each JSONL record should include `tool`, `arguments`, `progress_key`, `completed_items`, and `open_items` when available.

## Workflow
Observe → measure baseline → diagnose loop signature → form hypothesis → apply guard/recovery → measure again → independently verify.

## Metrics
Repeated-call incidents/run; no-progress streak length; completed acceptance items/100 steps; reopened work; tokens to completion; recovery success; false-stop rate; verification coverage.

## Verification
Run `python -m unittest tests/test_convergence_guard.py` and replay representative successful and stuck traces.

## Safety
The guard MUST NOT infer hidden chain-of-thought. It uses only observable tool/action metadata and task progress. Dangerous or irreversible recovery actions require explicit human approval.

## Failure handling
At warning threshold, require a changed hypothesis or different action. At stop threshold, terminate autonomous looping and produce one of: verified complete, self-contained clarification, or escalation with evidence. Maximum recovery cycles: 2.

## Definition of Done
**Implemented:** guard and hook integrated.  
**Measured:** baseline and post-change convergence metrics captured.  
**Verified:** stuck fixtures stop early, productive long traces continue, false-stop target is met, and independent review confirms bounded recovery.

## Customization
Replace progress keys with domain-specific acceptance criteria while keeping repetition and retry bounds observable and deterministic.