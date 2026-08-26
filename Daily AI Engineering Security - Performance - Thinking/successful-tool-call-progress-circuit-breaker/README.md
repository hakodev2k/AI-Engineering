# Successful Tool-Call Progress Circuit Breaker

**Category:** Performance  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Production agents can re-issue the same successful tool call repeatedly after receiving a valid result. This wastes model/tool calls, context, latency, and can duplicate side effects.

## Evidence
See `evidence/research.md`. Current signals include Hermes Agent issue #89069 (2026-08-18), Vercel AI issue #17606 (2026-07-21), and AgentSysBench (2026-08-15).

## Existing approach
Step caps, model-side loop termination, warning prompts, retries, and result caches.

## Existing limitations
Step caps do not measure progress; caches can still burn model steps/tokens; exact string equality misses canonical-equivalent JSON; aggressive dedup can break legitimate polling; mutating calls require stronger safeguards.

## Proposed improvement
Insert a deterministic progress gate between model selection and execution. Canonicalize arguments, classify side effects, fingerprint successful calls, and block or replay only when policy proves the repeat is non-progressing.

## Architecture
- `evidence/research.md` — current signals, existing approaches, root cause
- `skills/loop-diagnosis.md` — evidence-driven diagnosis
- `rules/progress-contract.md` — enforceable constraints
- `subagents/performance-verifier.md` — independent verification
- `workflows/measure-diagnose-verify.md` — bounded workflow
- `scripts/tool_progress_guard.py` — deterministic gate
- `tests/test_tool_progress_guard.py` — regression suite

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/tool_progress_guard.py --history trace.jsonl --candidate candidate.json`

Exit `0` means execute/replay. Exit `3` means the circuit breaker blocks the candidate.

## Workflow
Observe → measure baseline → diagnose → form hypothesis → integrate gate → measure again → independently verify. See `workflows/measure-diagnose-verify.md`.

## Metrics
Repeated-successful-call rate, duplicate executions avoided, model steps avoided, tokens/task, median/p95 task latency, false-block rate, duplicate side-effect rate.

## Verification
Run `python -m unittest tests/test_tool_progress_guard.py`. A performance claim is valid only after before/after traces show fewer redundant calls with unchanged task quality.

## Safety
Read-only results may be replayed after threshold. Mutating calls MUST NOT be auto-replayed or suppressed without explicit idempotency semantics.

## Failure handling
Detection uses explicit reason codes. Diagnose at most twice. Fall back to normal safe execution for read-only ambiguity and human review for mutating ambiguity.

## Definition of Done
**Implemented:** gate integrated.  
**Measured:** baseline and post-change traces captured.  
**Verified:** redundant calls fall, task quality is preserved, no duplicate side effects occur, and an independent verifier passes the change.

## Customization
Adapters may supply progress keys and idempotency metadata, but canonical argument hashing and bounded repeat limits MUST remain.