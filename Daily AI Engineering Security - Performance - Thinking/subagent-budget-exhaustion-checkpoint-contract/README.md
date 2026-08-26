# Subagent Budget Exhaustion Checkpoint Contract

**Category:** Token

## Problem
Subagents can spend nearly all available token/spend/iteration budget, terminate at a provider or runtime limit, and return little or no durable work. Resume then repeats discovery, retrieval, and verification, multiplying cost and latency.

## Evidence
`evidence/research.md` documents recent public failures across Claude Code, Kimi CLI, Hermes Agent, and current budget-control patterns.

## Existing approach
Provider hard limits, account budgets, max iterations, usage dashboards, session resume, warning thresholds, and manual summaries.

## Existing limitations
Hard stops do not guarantee useful state was persisted before cutoff; iteration counts do not bound request size; session-local state may disappear; partial natural-language output can be mislabeled as completion; retries can re-spend the same work.

## Proposed improvement
Enforce a pre-model-call budget admission invariant with a protected checkpoint reserve. At soft pressure, persist durable partial state. If the next call would consume the reserve, yield before dispatch with an explicit `partial_budget_exhausted` terminal state.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gap, root causes.
- `config/policy.json` — pressure thresholds, checkpoint reserve, resume bound, terminal states.
- `scripts/budget_checkpoint_guard.py` — deterministic pre-call admission guard.
- `tests/test_budget_checkpoint_guard.py` — pressure/reserve regression fixtures.
- `skills/budget-aware-checkpointing.md` — reusable engineering procedure.
- `rules/budget-and-handoff.md` — enforceable budget/recovery requirements.
- `subagents/budget-verifier.md` — independent verification role.
- `workflows/measure-diagnose.md` — Measure → Diagnose → Hypothesize → Improve → Measure.
- `workflows/verify-resume.md` — exhaustion/restart/resume regression workflow.
- `hooks/pre-model-call.md` — blocking provider-dispatch integration point.

## Installation
Python 3.10+; standard library only.

## Configuration
Tune `soft_budget_ratio`, `hard_budget_ratio`, and `reserve_tokens_for_checkpoint` from measured workload traces. Keep the reserve large enough to serialize a deterministic checkpoint/status without another model call when possible.

## Usage
Create an event JSON and run:

`python scripts/budget_checkpoint_guard.py --event event.json --policy config/policy.json`

Exit 0 permits continuation according to the returned decision. Exit 3 means checkpoint-and-yield/block. Exit 2 means invalid input/evaluation failure.

## Workflow
Observe cutoff → measure baseline token/call loss → diagnose missing lifecycle invariant → form hypothesis → integrate pre-call gate/checkpoint → replay exhaustion → measure repeated tokens and recovery → independent verification → complete.

## Metrics
- Input/output tokens per task.
- Tokens and tool calls repeated after resume.
- Checkpoint coverage before cutoff.
- Useful-output-before-cutoff rate.
- Recovery latency.
- Cost/task when provider pricing is available.
- Result quality/regression rate after resume.

## Verification
Run `python -m unittest tests/test_budget_checkpoint_guard.py`. Deterministic reference tests were executed before publication. Production integration must additionally test real provider accounting, process restart, durable storage, workspace drift, and status propagation.

## Safety
Never save secrets in checkpoints. Never drop correctness-critical context merely to reduce tokens. Dangerous or irreversible actions still require explicit human approval. Budget pressure never overrides authorization or security boundaries.

## Failure handling
**Detection:** guard block, provider budget error, missing checkpoint, false terminal state, or repeated rediscovery after resume.  
**Evidence:** preserve usage record, checkpoint identity, terminal event, and workspace identity.  
**Retry policy:** maximum two diagnosis/resume attempts unless explicitly overridden by a human.  
**Fallback:** stop new model calls and return durable partial state.  
**Escalation:** unreliable accounting, missing durable state, repeated resume failure, or workspace conflict.  
**Stop condition:** verified completion, safe checkpoint-and-yield, invalid accounting block, or retry exhaustion.

## Definition of Done
**Implemented:** pre-call guard, protected reserve, durable checkpoint, explicit partial terminal state, and resume path integrated.  
**Measured:** baseline and post-change tokens/calls/recovery metrics captured.  
**Verified:** unit tests pass; simulated exhaustion blocks the over-budget dispatch; checkpoint survives restart; resume avoids unnecessary rediscovery; result quality and security boundaries are preserved; no blocking issue remains.

## Customization
Adapt budget units to tokens, provider credits, cost, or iterations, but keep conservative pre-call admission, protected handoff reserve, durable task-scoped checkpoints, explicit partial terminal semantics, bounded resume attempts, and measurable before/after verification.
