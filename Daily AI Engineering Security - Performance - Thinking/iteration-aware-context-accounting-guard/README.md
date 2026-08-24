# Iteration-Aware Context Accounting Guard

**Category:** Token

## Problem
Agent runtimes increasingly expose usage at several layers: top-level request totals, per-iteration usage, cached input, persisted reasoning, and locally estimated context. Recent 2026 bugs show these quantities can be summed or re-added even when they represent the same model-visible context, making context occupancy appear far larger than reality and triggering compaction hundreds of thousands of tokens early.

## Evidence
See `evidence/research.md`. Current independent reports include Codex double-counting historical GPT-5.6 `all_turns` reasoning in 76/76 replayed auto-compactions and Claude Code summing two full-context message iterations around an advisor call, making ~516K real context appear as ~1.03M.

## Existing approach and limitation
Most runtimes trust provider top-level usage and apply local additions for content not believed to be included. This is efficient when the inclusion contract is reliable. It becomes fragile when a transport/header is absent, top-level usage represents cumulative billing work instead of final context state, or model/provider semantics change.

## Proposed improvement
Separate **billing work**, **final request context**, and **locally appended context**. Prefer the final model-message iteration for occupancy when iteration detail exists; never sum repeated full-context iterations. Treat locally estimated reasoning as additive only when an explicit inclusion contract says the provider omitted it. Fail closed to `unknown` when usage provenance is ambiguous rather than forcing compaction from an inflated number.

## Package tree
- `evidence/research.md` — current signals and root causes.
- `skills/context-accounting-analysis.md` — investigation procedure.
- `rules/context-accounting-rules.md` — enforceable accounting invariants.
- `subagents/accounting-verifier.md` — independent verification role.
- `workflows/reconstruct-and-verify.md` — bounded measure/diagnose workflow.
- `hooks/pre-compaction-accounting-check.md` — deterministic gate contract.
- `scripts/usage_accounting_guard.py` — JSON/JSONL analyzer.
- `tests/test_usage_accounting_guard.py` — regression cases.

## Installation
Python 3.10+; no third-party packages.

## Usage
Analyze a JSON/JSONL usage export:

`python3 scripts/usage_accounting_guard.py analyze trace.jsonl --window 272000 --threshold 244800`

The analyzer reports top-level apparent input, final-message context, inflation ratio, and whether the same compaction decision would be made under each interpretation.

## Metrics
Tokens/task, effective context occupancy, apparent/effective ratio, premature-compaction count, compactions/task, cache-read tokens, reasoning-estimate additions, post-compaction refill, cost/task, latency/task, and quality/regression rate.

## Verification
Run `python3 -m unittest tests/test_usage_accounting_guard.py`. For production traces, replay at least 30 compaction decisions or all decisions in a smaller reproducible dataset. **Implemented** means the accounting distinction exists. **Measured** means raw and reconstructed values are recorded. **Verified** means the reconstructed occupancy matches model-visible request evidence and premature decisions fall without correctness/context-loss regression.

## Safety
Never suppress a required compaction merely to save tokens. When effective context cannot be established confidently, prefer a conservative warning/manual decision. Do not discard security instructions, approvals, or task-critical context.

## Failure handling
Malformed telemetry returns exit 1. Proven accounting inflation that changes the compaction decision returns exit 2. Retry parsing at most twice after schema mapping changes; if provenance remains ambiguous, stop and escalate rather than guessing.

## Definition of Done
Evidence documented; raw usage preserved; current accounting replayed; final-state context reconstructed; inflation source identified; improvement implemented; tests pass; before/after compaction decisions compared; result quality/context-retention regression checked; independent verifier signs off; no blocking ambiguity remains.

## Customization
Map provider-specific fields into the normalized schema but keep billing totals and occupancy separate. Version the mapping by runtime/model/transport.