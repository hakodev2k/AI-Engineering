# No-Progress Retry Circuit Breaker

**Category:** Thinking

## Problem
AI-agent runtimes need retries, but retries can become expensive zero-progress loops when they repeat deterministic failures, restart healthy long-running work, discard checkpoints, or mistake continuation text for progress.

## Evidence
`evidence/research.md` documents current August 2026 signals from Anthropic Claude Code and OpenAI Codex, including false-positive stall watchdog kills, identical deterministic tool-failure retries, and automatic continuation/tool-selection loops.

## Existing approach
Fixed watchdogs, automatic retry/backoff, manual interrupt/resume, timeout configuration, status polling, and natural-language instructions to change approach.

## Existing limitations
Elapsed time is not a reliable progress signal; backoff does not alter deterministic failure causes; retries can lose checkpoints; and model self-report is not an enforceable stop condition.

## Proposed improvement
Represent retry decisions as observable engineering state: stable retry keys, normalized failure signatures, qualifying progress events, bounded attempt/token budgets, checkpoint reuse, deterministic pre-retry gating, and independent outcome verification.

## Architecture
```text
no-progress-retry-circuit-breaker/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-retry-gate.md
├── rules/
│   └── retry-and-stop-conditions.md
├── scripts/
│   └── progress_circuit_breaker.py
├── skills/
│   └── progress-ledger-analysis.md
├── subagents/
│   └── verification-agent.md
├── tests/
│   └── test_progress_circuit_breaker.py
└── workflows/
    └── diagnose-retry-verify.md
```

## Installation
Requires Python 3.10+ and only the standard library.

## Configuration
The script defaults to:
- maximum identical failures per retry key: `2`
- maximum consecutive no-progress attempts: `2`
- maximum tokens per retry key: `200000`

Set stricter values for production or high-cost workflows. Increasing limits requires measured justification; it must not be used to hide a loop.

## Usage
Create a JSONL attempt ledger. Each row requires:
- `retry_key`
- `attempt`
- `failure_signature`
- `events`
- `tokens`

Qualifying progress event names are `file_change`, `test_state_change`, `checkpoint`, `new_evidence`, and `tool_result_changed`.

Run:
`python scripts/progress_circuit_breaker.py attempts.jsonl`

Then run:
`python -m unittest tests/test_progress_circuit_breaker.py`

## Workflow
Observe → capture baseline state → diagnose failure type → form a changed causal hypothesis → pre-retry gate → recover/resume → measure external state → bounded retry if justified → independent verification.

## Metrics
Retries/task, identical-failure count, consecutive no-progress attempts, tokens/retry key, checkpoint reuse rate, recovery success rate, rework avoided, and externally verified completion rate.

## Verification
The unit tests cover productive recovery, repeated identical failure, semantic no-progress, and token-budget exhaustion. The implementation agent is not the only verifier.

## Safety
A retry circuit breaker does not authorize actions. Existing authorization, least-privilege, sandbox, and human-approval requirements remain in force. Dangerous or irreversible retries require explicit approval when platform policy demands it.

## Failure handling
**Detection:** circuit-breaker exit code 3, malformed ledger exit code 2, or verification failure.  
**Evidence:** normalized attempt ledger, checkpoint reference, and external state snapshot.  
**Retry policy:** default maximum two consecutive no-progress attempts.  
**Maximum retries:** bounded by configured identical-failure/no-progress budgets.  
**Fallback:** stop automatic work and preserve the latest valid checkpoint.  
**Escalation:** unresolved infrastructure failure, destructive action, or no causal change available.  
**Stop condition:** policy budget exceeded or independent verification cannot confirm progress.

## Definition of Done
- Current evidence documented.
- Existing retry approaches and limitations identified.
- Retry keys and progress events defined.
- Deterministic gate implemented.
- Tests pass.
- Resource budgets are measurable.
- Checkpoint/recovery behavior is defined.
- Automatic loops are bounded.
- Independent verification checks external state.
- No blocking issue remains.

## Status semantics
**Implemented** means the ledger/gate/workflow exist.  
**Measured** means attempts and resource costs have been captured on the target workflow.  
**Verified** means tests pass and an independent reviewer confirms that progress and completion are externally evidenced.

## Customization
Add domain-specific progress events only when they correspond to observable state changes. Do not classify repeated assistant narration, plans, or heartbeats without state evidence as progress.
