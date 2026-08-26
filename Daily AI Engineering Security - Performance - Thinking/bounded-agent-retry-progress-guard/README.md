# Bounded Agent Retry and Progress Guard

**Category:** Thinking

## Problem
AI agent runtimes can detect errors, retry, compact context, and repeat actions without a shared run-level stop condition. Backoff may only slow the loop, while model-driven recovery can repeatedly choose the same ineffective action.

## Evidence
Current public reports include OpenCode #41848 (August 11, 2026: no maximum LLM retry attempts), OpenCode #27924 (infinite compaction loop), and OpenAI Codex #38124 (August 12, 2026: a task reportedly repeated the same activity for roughly three hours). See `evidence/research.md`.

## Existing approach
Exponential backoff, retryable-error classification, per-call timeouts, compaction, loop heuristics, and prompts asking the agent to reconsider.

## Existing limitations
These mechanisms are usually local to one subsystem. They do not necessarily provide a shared progress predicate, run-level retry budget, normalized action equivalence, or terminal escalation state.

## Proposed improvement
Use a deterministic post-step guard that tracks consecutive retries, repeated action signatures, and steps without observable progress. Budget exhaustion moves the run to `halt_and_escalate`; resumption requires a materially different recovery path through a bounded workflow.

## Architecture
```text
bounded-agent-retry-progress-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/post-step-progress-check.md
├── rules/bounded-recovery.md
├── scripts/retry_progress_guard.py
├── skills/progress-contract-analysis.md
├── subagents/independent-verifier.md
├── tests/test_retry_progress_guard.py
└── workflows/
    ├── failure-recovery.md
    └── run-with-bounded-recovery.md
```

## Installation
Python 3.10+; no third-party packages required.

## Configuration
`config/policy.json` defines maximum consecutive retries, repeated identical actions, and no-progress steps. Choose limits from measured workload behavior; do not raise them solely to make a failing run complete.

## Usage
Write one JSON object per step to a trace file with fields such as `event`, `action_signature`, and `progress`. Then run:

`python scripts/retry_progress_guard.py --trace trace.jsonl --policy config/policy.json`

Supported monitored event types include `retry`, `tool`, `model`, and `compact`.

## Workflow
Start with `workflows/run-with-bounded-recovery.md`. On `halt_and_escalate`, switch to `workflows/failure-recovery.md`. Integrate `hooks/post-step-progress-check.md` after each retry/recovery-relevant step.

## Metrics
Retries per task; repeated-action streak; no-progress steps; tokens and time since last progress event; time to escalation; successful recovery rate; repeat-halt rate.

## Verification
Run `python -m unittest tests/test_retry_progress_guard.py`. The independent verifier must confirm that each `progress=true` marker corresponds to observable task-state improvement rather than model narrative.

## Safety
The package never requests hidden chain-of-thought. It relies on observable events, facts, evidence, acceptance criteria, checkpoints, budgets, and verification status. Dangerous or irreversible actions require stricter limits and explicit human approval.

## Failure handling
Detection: guard exit 3 or missing/invalid trace data. Evidence: counters, recent signatures, last verified checkpoint, failed hypotheses. Retry policy: maximum two materially different recovery hypotheses during the primary run; one controlled resume after halt. Fallback: keep the run halted at the last verified checkpoint. Escalation: operator or engineering owner. Stop condition: exhausted budget, repeated causal failure, dangerous action without approval, or unobservable progress.

## Definition of Done
**Implemented:** post-step guard is integrated into the actual agent loop.  
**Measured:** baseline retry/progress traces and counters are captured.  
**Verified:** tests pass; all loops have finite budgets; progress markers map to observable state; halted runs cannot silently restart; no unsupported success claim remains.

## Customization
Extend action-signature normalization and progress predicates per domain, for example failing-test count, benchmark score, completed work units, evidence coverage, or verified artifact changes. Preserve finite budgets and deterministic terminal escalation.
