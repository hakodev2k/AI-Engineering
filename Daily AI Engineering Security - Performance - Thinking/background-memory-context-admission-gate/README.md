# Background Memory Context Admission Gate

Category: **Token**

## Problem
Background memory/extraction jobs can submit entire historical rollouts to a model without a reliable model-aware preflight. Oversized or token-dense transcripts then consume quota, exceed the context window, retry unchanged, and silently leave durable memory coverage incomplete.

## Evidence
See `evidence/research.md`. August 2026 Codex reports document a 30.7% `memory_stage1` failure rate dominated by context overflow, whole-transcript submission without a size ceiling, and byte-based token approximation that can exceed the actual model window.

## Proposed improvement
Put deterministic admission before background memory generation: estimate or accept provider-counted tokens, reserve response/system headroom, classify deterministic overflows as `needs_rechunk` rather than retryable errors, and produce a bounded chunk plan instead of dropping the session.

## Package tree
- `evidence/research.md`
- `skills/memory-admission-analysis.md`
- `rules/memory-admission-rules.md`
- `subagents/memory-coverage-reviewer.md`
- `workflows/admit-chunk-verify.md`
- `hooks/pre-memory-generation.md`
- `config/policy.example.json`
- `scripts/memory_admission.py`
- `tests/test_memory_admission.py`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/memory_admission.py --input rollout.jsonl --policy config/policy.example.json`

Exit codes: 0 admitted; 2 rechunk/block required; 3 invalid input/config.

## Metrics
Estimated input tokens/job, admitted ratio, deterministic overflow count, wasted retry count, memory-coverage ratio, chunk count, tokens processed per useful memory artifact.

## Verification
Run `python -m unittest tests/test_memory_admission.py`. Passing tests distinguish admitted input from deterministic overflow and create bounded chunk ranges with reserved headroom.

## Safety
The gate never deletes source history and never reduces required security/user constraints. It reads the rollout as data only.

## Failure handling
Malformed input/config fails closed. Deterministic overflow MUST NOT consume normal retry budget; rechunk at most twice before escalation.

## Definition of Done
Evidence recorded, baseline token estimate measured, admission decision deterministic, overflow mapped to bounded chunks, retries bounded, tests pass, and memory coverage can be measured separately from successful foreground work.
