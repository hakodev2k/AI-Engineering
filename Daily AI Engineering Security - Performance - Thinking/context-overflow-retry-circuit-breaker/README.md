# Context Overflow Retry Circuit Breaker

**Category:** Token

## Problem
Agent runtimes can misclassify deterministic context-capacity failures as generic retryable provider errors, causing repeated oversized requests, ineffective compaction loops, excess token spend, and stalled tasks.

## Evidence
See `evidence/research.md` for current 2026 signals from OpenCode, Kilo Code, and Pi/OpenRouter integrations.

## Existing approach
Provider-specific overflow string matching, automatic compaction, generic backoff/retry, static context-window settings, and manual session/model reset.

## Existing limitations
Provider errors vary; generic retry handling may win over overflow classification; compaction may not shrink immutable context; repeated retries often lack measurable progress requirements.

## Proposed improvement
A provider-agnostic preflight and retry circuit breaker that measures immutable/evictable context separately, normalizes overflow signals, requires compaction progress, bounds retry/compaction attempts, and fails fast when required context cannot fit.

## Architecture
```text
context-overflow-retry-circuit-breaker/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-model-call.md
├── rules/token-budget-and-retry.md
├── scripts/overflow_circuit_breaker.py
├── skills/context-budget-analysis.md
├── subagents/token-verifier.md
├── tests/test_overflow_circuit_breaker.py
└── workflows/
    ├── failure-recovery.md
    └── preflight-compact-verify.md
```

## Installation
Python 3.10+; standard library only. Integrate the pre-model hook with a provider/model token estimate.

## Configuration
Set the model context limit and reserved output in `config/policy.json`. Preserve a safety margin and bounded compaction/retry counts.

## Usage
Serialize current token-budget state to an event JSON and run:
`python scripts/overflow_circuit_breaker.py --event event.json --policy config/policy.json`

## Workflow
Use `workflows/preflight-compact-verify.md` for normal prevention/recovery and `workflows/failure-recovery.md` after deterministic fail-fast.

## Metrics
Input tokens/task; retries/task; compaction attempts; cost/task; latency; overflow recovery rate; context utilization; representative quality regression rate.

## Verification
Run `python -m unittest tests/test_overflow_circuit_breaker.py`. Verify both token reduction and a representative task-quality fixture before rollout.

## Safety
Required security policy, user requirements, acceptance criteria, and correctness-critical facts are not removed solely to save tokens. The circuit breaker stops repeated signatures rather than hiding failure.

## Failure handling
Detection: preflight or normalized provider signal. Evidence: token budget and reason code. Maximum compaction attempts: 2 by default. Fallback: compatible larger-context routing or bounded task decomposition. Escalation: immutable context cannot fit. Stop condition: no progress, exhausted attempt budget, or threatened critical-context loss.

## Definition of Done
- **Implemented:** preflight/circuit breaker runs before model requests and overflow retries.
- **Measured:** tokens, retries, latency/cost, and recovery metrics are captured before/after.
- **Verified:** tests pass, repeated oversized requests are bounded, successful compaction makes measurable progress, and quality fixtures show no critical context loss.

## Customization
Extend provider error patterns only as supplemental evidence; keep preflight token math and progress checks provider-agnostic.
