# Context Compaction Retry Circuit Breaker

**Category:** Token

## Problem
Long-running agent sessions can enter self-amplifying context-compaction retry loops. A failed oversized summary attempt may persist retry debris, increase the next compaction input, trigger another context-limit failure, and burn large token volumes without user-visible progress.

## Evidence
See `evidence/research.md` for current public evidence and source links.

## Existing approach
Most runtimes compact or summarize automatically after context pressure, then retry. Some add retry counters, backoff, truncation, or manual fresh-session recovery.

## Existing limitations
Retrying the same oversized compaction input does not guarantee convergence. Persisting failed-attempt diagnostics can make the next attempt larger. Generic API retry logic often cannot distinguish a transient provider failure from deterministic context-budget failure.

## Proposed improvement
Add a pre-compaction budget gate, stable failure fingerprint, durable-debris exclusion, monotonic-shrink requirement, bounded retry cap, and fail-closed handoff to a fresh continuation when convergence cannot be proven.

## Architecture
```text
context-compaction-retry-circuit-breaker/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-compaction.md
├── rules/compaction-retry.md
├── scripts/compaction_guard.py
├── skills/compaction-diagnosis.md
├── subagents/recovery-verifier.md
├── tests/test_compaction_guard.py
└── workflows/measure-diagnose-recover.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json`. Keep `max_attempts` small and require each retry to shrink the estimated input. Do not reduce correctness-critical context solely to satisfy the budget.

## Usage
```bash
python scripts/compaction_guard.py --state state.json --policy config/policy.json
```

Required state fields are `attempt`, `input_tokens`, `context_limit`, `reserved_output_tokens`, `previous_input_tokens`, `failure_fingerprint`, `previous_failure_fingerprint`, and `durable_retry_debris_tokens`.

## Workflow
Follow `workflows/measure-diagnose-recover.md`: Observe → Measure → Diagnose → Form hypothesis → Implement a smaller recovery → Measure again → independently verify.

## Metrics
Tokens consumed per recovery, retries per recovery, monotonic-shrink compliance, successful continuation rate, context-limit regression rate, and post-recovery quality regression.

## Verification
```bash
python -m unittest tests/test_compaction_guard.py
```
The Recovery Verifier must also confirm a sampled set of task-critical facts survives the fresh continuation when fallback is used.

## Safety
The guard never deletes source conversation data. A stop decision requires bounded fallback rather than weakening correctness-critical context.

## Failure handling
Detection uses explicit reason codes. Automatic attempts are policy-bound. If a retry does not shrink, repeats the same failure, exceeds retry-debris budget, or cannot fit reserved headroom, stop automatic compaction and create a fresh bounded continuation from a verified summary.

## Definition of Done
**Implemented:** guard, policy, hook, workflow, rules, skill, and verifier are integrated.  
**Measured:** pre/post token counts, retry counts, and debris counts are captured.  
**Verified:** tests pass, retries are bounded, retry input shrinks, failure debris is excluded, and no correctness-critical context is silently dropped.

## Customization
Tune token thresholds by model/context limit, but preserve the monotonic-shrink invariant and finite retry cap.
