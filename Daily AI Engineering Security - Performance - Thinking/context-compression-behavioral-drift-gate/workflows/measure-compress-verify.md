# Workflow: Measure → Compress → Verify

## Trigger
Context pressure, cost policy, or explicit context-compaction request.

## Goal
Reduce current prompt tokens while preserving all correctness- and safety-critical information.

## Inputs
Current context, task state, token measurement source, policy, and optional probes.

## Baseline
Use `skills/compression-baseline.md` to capture current-context tokens and preservation contract.

## Context
Do not expose hidden reasoning. Use observable task state: requirements, facts, assumptions, decisions, evidence, tool results, identifiers, pending work, and safety boundaries.

## Stages
1. **Observe** — identify why compaction is needed and confirm current-context pressure.
2. **Measure baseline** — collect token count and preservation contract.
3. **Diagnose** — classify token-heavy regions: repeated instructions, large tool outputs, stale history, duplicated repository context, or verbose summaries.
4. **Form hypothesis** — choose one strategy: deduplication, selective offload, hierarchical summary, retrieval-on-demand, or provider caching.
5. **Implement candidate** — create a candidate compacted context without destroying the original.
6. **Measure again** — calculate candidate tokens using the same measurement method where possible.
7. **Verify** — execute `scripts/context_drift_gate.py` and task probes.
8. **Decision** — if improved and verified, activate candidate; otherwise provide structured failures and retry.
9. **Final verification** — Context Verifier independently reviews evidence.

## Responsible agent
Owning agent creates the candidate. `subagents/context-verifier.md` performs independent verification.

## Tools
Tokenizer/provider usage, deterministic parsers, drift-gate script, and read-only task probes.

## Outputs
Baseline, candidate, gate result, verification record, and before/after metrics.

## Checkpoints
- Baseline complete before candidate generation.
- Original context remains recoverable until final verification.
- Gate result saved before activation.

## Metrics
Tokens/task, reduction ratio, retention rates, probe pass rate, number of retries, post-compaction regression.

## Retry policy
Maximum two compaction retries by default. Each retry must address explicit failed contract entries.

## Stop conditions
Stop successfully only after independent verification. Stop unsuccessfully when retry budget is exhausted, a safety invariant is lost, or measurement cannot support a claimed improvement.

## Failure path
Restore original context and choose selective offloading/caching or request a larger context model. Do not reduce safety or correctness requirements.

## Verification
All critical invariants retained, required probes pass, and token reduction meets policy.

## Definition of Done
Evidence documented; baseline measured; candidate measured; critical retention 100%; probes pass; useful token reduction demonstrated; verifier reports Verified; no blocking issue remains.