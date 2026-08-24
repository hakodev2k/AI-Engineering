# Large Diff Memory Budget Guard

## Topic
Bound memory and serialization amplification from large-file change tracking, diff rendering, event logging, history persistence, and hydration.

## Category
Performance

## Problem
A small edit to a very large file can cause an agent runtime to retain and duplicate much more data than the actual change: baseline/current contents, full replacement diffs, event clones, debug logs, JSONL records, UI hydration copies, and child-agent context. Without byte budgets this can grow to OOM-scale resource usage.

## Evidence
See `evidence/research.md`. August 2026 public reports include a `TurnDiffTracker` path growing RSS toward ~70 GB, a 203 MB single history record that crashes task hydration, and multi-agent fan-out creating hundreds of GiB of duplicated rollout storage.

## Existing approach
Time-bounded diffing, history persistence, context compaction, generated-file ignores, and OS/container memory limits reduce some risk but do not enforce a shared byte contract across all change-observability layers.

## Existing limitations
A timeout can still emit a huge whole-file diff; component-local limits miss downstream copies; ignore files are configuration-dependent; OOM detection is too late; persisted events can be individually unbounded.

## Proposed improvement
Measure first, then enforce layered byte budgets before full representations are allocated: source tracking, rendered diff, event/log payload, persisted record, and task aggregate. Above budget, preserve operation metadata, size, hash, bounded excerpt and/or controlled artifact reference with explicit elision status.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `skills/change-observability-budgeting.md` — measurement and optimization procedure.
- `rules/change-byte-budget-rules.md` — enforceable byte-budget invariants.
- `subagents/memory-regression-verifier.md` — independent verifier.
- `workflows/profile-bound-measure-verify.md` — bounded performance workflow.
- `hooks/pre-track-size-gate.md` — deterministic pre-tracking/persistence gate.
- `scripts/large_change_profiler.py` — streaming size profiler for repositories and JSONL histories.
- `tests/test_large_change_profiler.py` — file and history-record threshold regression fixtures.

## Actual package tree
```text
large-diff-memory-budget-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-track-size-gate.md
├── rules/change-byte-budget-rules.md
├── scripts/large_change_profiler.py
├── skills/change-observability-budgeting.md
├── subagents/memory-regression-verifier.md
├── tests/test_large_change_profiler.py
└── workflows/profile-bound-measure-verify.md
```

## Installation
Python 3.9+ is sufficient for the reference profiler and tests. No third-party packages are required.

## Configuration
The profiler defaults to a 5 MB repository-file threshold and 2 MB JSONL-record threshold. These are safe example starting points, not universal production values. Production budgets MUST be derived from baseline memory, file mix, review requirements, and runtime architecture.

## Usage
Repository preflight:

`python scripts/large_change_profiler.py --repo /path/to/repo --max-file-bytes 5000000`

History preflight:

`python scripts/large_change_profiler.py --jsonl rollout.jsonl --max-record-bytes 2000000`

Regression fixtures:

`python tests/test_large_change_profiler.py`

## Workflow
Use `workflows/profile-bound-measure-verify.md`: Observe → Measure baseline → Diagnose amplification → Hypothesize → Bound early → Measure again → at most one revision → independent verification.

## Metrics
Peak RSS, RSS/edit, max tracked/diff/event/history bytes, session disk bytes, hydration latency, amplification ratio, bounded-fallback frequency, normal-review regression rate.

## Verification
**Implemented** means size gates/fallbacks exist. **Measured** means identical baseline and post-change workload metrics exist. **Verified** requires tests plus representative evidence that peak memory/record size is bounded or materially reduced while required change review/audit evidence remains available.

## Safety
Never silently truncate change evidence. Never discard correctness- or security-required context merely for performance. Oversized content should be represented by verifiable metadata/hash/reference or safely spilled rather than invisibly dropped.

## Failure handling
Detection: profiler/gate threshold or memory regression. Evidence: size/RSS/event measurements. Retry: maximum one evidence-driven optimization revision. Fallback: bounded reference/spill representation. Escalation: document unbounded stage and stop optimization if evidence cannot be preserved. Stop condition: verified result, failed revision, or correctness/audit regression.

## Definition of Done
Current evidence documented; baseline captured; amplification stage identified; byte budgets applied before costly duplication; regression tests pass; large-file/history fixtures are bounded; before/after measurements complete; normal review remains acceptable; independent verifier returns `verified`.

## Customization
Add runtime-specific counters at tracker, event bus, serializer, and UI boundaries. Prefer shared task-level accounting so each layer cannot independently consume the full budget. For multi-agent systems, use immutable artifact references and selective loading instead of duplicating large parent context.
