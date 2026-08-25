# Agent History Single-Writer Dedup Guard

**Category:** Token

## Problem
Agent runtimes can persist the same conversation through multiple layers—workflow executor, history provider, transport adapter, gateway, checkpoint, or per-model-call middleware. When more than one layer appends full-history payloads instead of deltas, stored transcripts grow superlinearly and later model requests repeatedly pay for duplicate messages. Duplicate tool-call/result sequences can also become structurally invalid.

## Evidence
See `evidence/research.md`. Current public evidence includes Microsoft Agent Framework bugs where per-service-call persistence re-appends accumulated history and streaming middleware loses the sentinel that prevents a second history injection; Hermes reports independent multi-writer SQLite duplication and exponential Responses API history doubling.

## Existing approach
Frameworks provide history providers, checkpoint stores, conversation IDs/sentinels, message filters, compaction, and application workarounds such as no-op providers or custom middleware.

## Existing limitations
Ownership of persistence is often implicit; append APIs do not know whether a message was already committed; full transcripts and deltas share similar types; transport/middleware transformations can drop metadata identifying service-managed history; compaction reduces symptoms after duplication but does not restore single-write semantics.

## Proposed improvement
Declare exactly one authoritative append writer for each conversation scope, assign stable message identities before persistence, require delta-only append semantics, and deterministically reject re-appends. Measure amplification as `append_events / unique_message_ids` and model-visible duplicate ratio before and after integration.

## Architecture
- `evidence/research.md` — current signals, existing approaches, limitations, root causes.
- `skills/history-write-ownership-audit.md` — baseline and root-cause procedure.
- `rules/history-single-writer-contract.md` — observable token-control invariants.
- `subagents/history-budget-verifier.md` — independent verification role.
- `workflows/history-persistence-hardening.md` — bounded measure/repair/re-measure workflow.
- `hooks/pre-history-commit.md` — deterministic commit gate.
- `scripts/history_write_guard.py` — dependency-free trace validator and amplification reporter.
- `tests/test_history_write_guard.py` — executable regression tests.
- `examples/history-trace.json` — valid single-writer example.

## Installation
Python 3.10+; no third-party packages.

## Usage
```bash
python scripts/history_write_guard.py examples/history-trace.json
python -m unittest tests/test_history_write_guard.py
```
Exit `0` means one active append writer and no duplicate message commits; exit `2` means the trace violates the contract; exit `1` means invalid input/runtime failure.

## Workflow
Observe persistence paths → measure baseline append/unique/token ratios → identify all writers → form ownership hypothesis → choose one authoritative writer → enforce stable IDs and delta append → measure again → run transcript structural checks → independently verify quality and token regression.

## Metrics
`active_append_writers`, total append events, unique message IDs, duplicate commits, append amplification ratio, model-visible duplicate ratio, input tokens/task, cost/task, history-store bytes, context utilization, provider structural errors, and task-quality regression rate.

## Verification
**Implemented:** deterministic guard, rules, workflow, hook, tests. **Measured:** adopting runtime records before/after append amplification and input-token usage on the same workload. **Verified:** duplicate commits fall to zero, active writer count is one, tokens/task decrease on duplication-affected workloads, tool-call pairing remains valid, and task-quality regression is absent.

## Safety
Deduplication must never delete semantically distinct messages merely because text matches. Stable IDs or framework event identity are preferred over content fingerprints. Required context is preserved; the guard blocks duplicate persistence rather than blindly truncating history.

## Failure handling
Detection: multiple active writers, repeated message ID, or malformed trace. Evidence: writer IDs and duplicate message IDs only—no secret payloads. Retry: maximum two ownership/integration fixes. Fallback: disable secondary persistence/loading path rather than deleting uncertain history. Escalation: session/history owner. Stop: unresolved identity ambiguity or quality regression.

## Definition of Done
Evidence documented; baseline measured; one authoritative append writer declared; stable message identity preserved end-to-end; delta-only commit enforced; no duplicate IDs committed; before/after token metrics collected; structural tool-call tests pass; quality does not regress; independent verification passes; no blocking issue remains.

## Customization
Map framework-specific message IDs into the trace. If a runtime lacks stable IDs, add IDs at message creation and carry them through middleware; use content hashing only for diagnostics, not destructive deduplication.