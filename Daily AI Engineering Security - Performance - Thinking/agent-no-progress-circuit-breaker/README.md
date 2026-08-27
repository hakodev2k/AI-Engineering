# Agent No-Progress Circuit Breaker

**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Autonomous agents can continue model/tool/verification loops after observable progress has stopped, causing unnecessary token spend, latency, repeated side effects, and misleading completion state.

## Evidence
`evidence/research.md` documents fresh August 2026 reports from OpenAI Codex, Hermes Agent, Qwen Code, and DeepSeek Harness discussions.

## Existing approach
Current systems commonly rely on provider quotas, per-tool retries/timeouts, natural-language completion instructions, manual cancellation, max-turn options where available, verification commands, and context compaction.

## Existing limitations
Those controls do not consistently detect aggregate no-progress behavior. Verification can itself loop when freshness state is stale; context compaction does not enforce convergence; per-tool limits miss alternating repeated actions.

## Proposed improvement
Add a deterministic orchestration-level circuit breaker before every autonomous continuation. Require structured progress events, hard step/token budgets, repeated-action fingerprints, and fresh verification receipt identity.

## Architecture
The guard is deliberately outside model reasoning: the model cannot silently waive its own execution bounds. A separate reviewer verifies recovery.

## Actual package tree
```text
agent-no-progress-circuit-breaker/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-next-step.md
├── rules/
│   └── loop-safety.md
├── scripts/
│   └── progress_guard.py
├── skills/
│   └── progress-diagnosis.md
├── subagents/
│   └── verification-reviewer.md
├── tests/
│   └── test_progress_guard.py
└── workflows/
    └── observe-diagnose-recover.md
```

## Installation
Python 3.10+ is sufficient; there are no third-party dependencies.

## Configuration
Tune `config/policy.json` from measured task baselines. Keep hard budgets conservative until false-positive data exists. A circuit-open event must not be auto-cleared by the same run.

## Event contract
Each JSONL event should contain `action`, `target`, `result`, `progress`, `input_tokens`, and `output_tokens` when available. Verification events should include `verification_receipt`, ideally a hash or immutable ID bound to the exact workspace/input state.

## Usage
```bash
python scripts/progress_guard.py --trace task-trace.jsonl --policy config/policy.json
```
Exit codes: `0` continue, `2` invalid evidence/configuration, `3` stop/circuit-open.

## Workflow
Follow `workflows/observe-diagnose-recover.md`: Observe → Measure → Diagnose → Hypothesize → Implement → Measure again → independent Verify. Recovery is bounded to two attempts.

## Metrics
- Steps per task.
- Total input/output tokens.
- Maximum consecutive no-progress steps.
- Maximum repeated action fingerprint count.
- Repeated identical verification receipt count.
- Circuit-open false-positive rate.
- Avoided token/time cost after stop.

## Verification
Run:
```bash
python -m unittest tests/test_progress_guard.py
```
The tests cover repeated actions, legitimate progress, stale verification receipts, token budget overflow, and empty-trace fail-closed behavior.

## Safety
The guard never requests hidden chain-of-thought. It uses only observable run state. It must not be bypassed to preserve throughput, and it does not weaken security or verification requirements.

## Failure handling
**Detection:** non-zero guard result or missing evidence.  
**Evidence:** preserve trace, policy and artifact/receipt identity.  
**Retry policy:** maximum 2 recovery attempts.  
**Fallback:** stop autonomous continuation and resume from a new human-authorized run boundary.  
**Escalation:** recurrence after two distinct fixes or uncertain state integrity.  
**Stop condition:** exhausted retries, hard budget breach, or unverifiable progress state.

## Definition of Done
- **Implemented:** pre-next-step guard and structured event capture are wired into the runner.
- **Measured:** baseline and post-change loop metrics are captured.
- **Verified:** regression tests pass; a separate reviewer confirms fresh verification identity and bounded loops; no blocking issue remains.

## Customization
Add domain-specific progress evidence such as changed test count, accepted diff hash, queue depth, completed work-unit IDs, or external transaction receipts. Do not count free-form status messages as progress.
