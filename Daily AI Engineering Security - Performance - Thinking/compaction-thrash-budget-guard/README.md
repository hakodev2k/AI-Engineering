# Compaction Thrash Budget Guard

**Category:** Token

## Problem
Long-running coding-agent sessions can enter a compaction feedback loop: large static attachments or rolled-up usage estimates refill the context immediately after compaction, causing repeated compaction, cache rewrites, latency spikes, and large token burn without proportional task progress.

## Evidence
See `evidence/research.md` for current August 2026 reports and existing mitigations.

## Existing approach
Agent runtimes compact automatically near context limits, use prompt caching, and expose usage telemetry. Manual `/compact` or session restart can recover some failures.

## Existing limitations
Compaction thresholds can be driven by distorted usage accounting; static context may be reattached after compaction; retry loops may repeatedly process full context; cache failures can amplify token creation costs. A large context window alone does not prevent thrash.

## Proposed improvement
Add a deterministic pre-compaction budget gate that measures effective context growth, compaction spacing, static payload repetition, cache creation/read ratios, and progress. The gate recommends `allow`, `defer-and-trim`, or `stop-and-recover` without discarding correctness-critical context.

## Architecture
- `config/policy.json` — measurable thresholds
- `scripts/compaction_guard.py` — JSONL profiler and gate
- `tests/test_compaction_guard.py` — deterministic regression suite
- `examples/sample-events.jsonl` — runnable trace example
- `skills/compaction-thrash-analysis.md` — investigation procedure
- `rules/context-budget.md` — enforceable token rules
- `subagents/token-performance-verifier.md` — independent verifier
- `workflows/measure-diagnose-optimize.md` — bounded optimization loop
- `hooks/pre-compaction.md` — blocking integration hook
- `evidence/research.md` — public evidence and root-cause analysis

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` only after collecting a baseline. Threshold changes MUST preserve required task context.

## Usage
```bash
python scripts/compaction_guard.py --trace examples/sample-events.jsonl --policy config/policy.json
```

Exit code `0` means the trace is within policy. Exit code `3` means deterministic intervention is required.

## Workflow
Measure baseline → diagnose static/context accounting pressure → form one hypothesis → reduce redundant context or correct accounting → measure again → independent verification.

## Metrics
Tokens/task, cache-read ratio, cache-creation ratio, compactions/100 turns, minimum turns between compactions, repeated-static tokens, p95 input tokens, task-progress events, and regression rate.

## Verification
Run:
```bash
python -m unittest tests/test_compaction_guard.py
```

## Safety
The guard MUST NOT trim user requirements, security constraints, unresolved evidence, or state required to safely continue. It only identifies redundant/reloadable context and unsafe retry behavior.

## Failure handling
Detection is deterministic. Maximum optimization retries: 2. If thrash remains, stop automatic compaction and require a recovery path such as a fresh session with verified state transfer.

## Definition of Done
**Implemented:** guard, policy, hook and workflow are integrated.  
**Measured:** before/after traces contain the required metrics.  
**Verified:** tests pass, compaction spacing improves or token usage drops without quality/security regression, and an independent verifier confirms critical context was retained.

## Customization
Add runtime-specific telemetry adapters upstream of the JSONL schema; keep the guard input stable and evidence-based.