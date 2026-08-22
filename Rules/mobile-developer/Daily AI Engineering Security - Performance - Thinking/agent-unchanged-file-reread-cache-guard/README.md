# Agent Unchanged-File Reread Cache Guard

## Topic
A deterministic, range-aware cache guard that prevents AI coding agents from repeatedly injecting unchanged file content while preserving correctness across edits, subagents, and context compaction.

## Category
**Token**

## Problem
Coding agents can repeatedly read files or ranges they already consumed even when the underlying content is unchanged. The result is avoidable input tokens, tool latency, context pressure, and sometimes no-progress reread loops. Compaction complicates optimization because file identity may still be known while exact source text is no longer resident in model context.

## Evidence
Current public signals are documented in `evidence/research.md`. They include OpenAI Codex #33498 reporting repeated retrieval of unchanged documents; Claude Code #86291 showing a repeated same-file/same-offset loop after compaction; Claude Code #85488 describing lost read-state and repeated rehydration tax; and existing community/native deduplication attempts.

## Existing approach
Common approaches are prompt rules, client-specific native deduplication, generic caching, and compacted conversation summaries.

## Existing limitations
Prompt rules depend on model compliance. Path-only caching can be stale. Whole-file caching cannot safely represent partial reads. Compaction can erase exact-text residency even if the file has not changed. Native behavior varies across products, versions, SDKs, and custom orchestration layers.

## Proposed improvement
Place a deterministic read ledger at the tool boundary. It records canonical path, range, content fingerprint, metadata, bytes, and context-residency status. Before reading, the host checks whether the requested range is already covered by the same fingerprint. If safe, it returns a compact `UNCHANGED_READ` receipt instead of duplicate content. Mutations invalidate entries. Compaction preserves identity but downgrades residency to `unknown`, forcing rehydration whenever exact text is required.

## Architecture
```text
Agent read request
      |
      v
PreRead hook ---- force/exact-context policy
      |
      v
read_cache_guard.py check
   | HIT                     | MISS
   v                         v
UNCHANGED_READ receipt    Normal host Read
                             |
                             v
                         PostRead record

Mutation ----------------> invalidate
Compaction ---------------> residency=unknown
Final verification -------> stats + replay tests
```

## Package structure
```text
agent-unchanged-file-reread-cache-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── read_cache_guard.py
└── tests/
    └── test-plan.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into the agent host repository or reference it from a shared engineering-rules repository. Keep runtime ledger files outside source control.

## Configuration
Edit `config/policy.json`. Key controls include hash algorithm, maximum hash bytes, range superset behavior, compaction residency behavior, mutation invalidation events, forced-read reasons, and verification thresholds.

## Usage
First read:
```bash
python scripts/read_cache_guard.py check src/service.cs --start 1 --end 200
# exit 2 => perform real read
python scripts/read_cache_guard.py record src/service.cs --start 1 --end 200 --returned-bytes 7400
```

Repeated unchanged read:
```bash
python scripts/read_cache_guard.py check src/service.cs --start 1 --end 200
# exit 0 => return UNCHANGED_READ receipt, do not inject duplicate content
```

After mutation:
```bash
python scripts/read_cache_guard.py invalidate src/service.cs
```

After compaction:
```bash
python scripts/read_cache_guard.py compact
python scripts/read_cache_guard.py check src/service.cs --start 1 --end 200 --require-context
# exit 2 => exact text must be rehydrated
```

Metrics:
```bash
python scripts/read_cache_guard.py stats
```

## Workflow
Use `workflows/workflows.md`: Observe → Baseline → Diagnose → Hypothesize → Integrate → Measure → Verify. The primary loop is bounded to two optimization revisions. Per-read guard failures fall back once to a normal read; there is no retry loop.

## Metrics
Track duplicate read bytes/task, estimated duplicate input tokens/task, identical read calls/task, redundant read latency, cache hit rate, forced rehydrations after compaction, false cache hits, context utilization, and task verification failures. The default target is at least 80% duplicate-byte reduction on a representative replay corpus with zero false cache hits.

## Verification
`tests/test-plan.md` defines deterministic fixtures for first reads, unchanged hits, changed content, equal-size modifications, partial-range coverage, compaction, invalidation, corrupt ledger behavior, symlinks, multi-agent sharing, and cross-worktree isolation.

Status must be explicit:
- **Implemented:** the guard and lifecycle hooks are wired.
- **Measured:** before/after metrics exist for the same corpus.
- **Verified:** acceptance gates pass, including zero stale substitutions.

## Safety
Optimization never outranks correctness. A cache hit requires content identity and compatible range coverage. Exact-text residency is tracked separately. After compaction, the system must rehydrate exact text when needed. Guard failure always falls back to a real read. Runtime ledgers store no source bodies and must not contain secrets.

## Failure handling
Detection signals include corrupt ledger, hash failure, uncovered range, changed fingerprint, uncertain mutation scope, and stale-substitution test failure. Retry policy is bounded: one deterministic fallback to normal read per failed guard decision and at most two optimization revisions during rollout. If stale substitution is observed, disable suppression and escalate with the failing fixture; do not weaken verification thresholds.

## Definition of Done
- Current evidence and existing approaches are documented.
- Duplicate-read baseline is captured.
- PreRead, PostRead, PostMutation, and PostCompaction lifecycle points are integrated.
- Deterministic script runs with meaningful exit codes.
- Changed-file and partial-range tests pass.
- Compaction distinguishes unchanged identity from exact-text residency.
- Before/after token/byte/latency metrics are collected on the same corpus.
- Duplicate bytes fall by the agreed threshold (default >=80%).
- False cache hits equal zero.
- No task-quality regression is observed.
- Risks and fallback behavior are documented.
- Independent verification is complete.

## Customization
For Git-backed repositories, a host may replace full hashing with Git blob/object identity plus working-tree dirty detection when equivalently safe. For very large files, use chunk/range fingerprints. For multi-agent systems, namespace ledgers by worktree/task generation and share only across trusted agents. Hosts with precise context-residency tracking can replace the conservative `unknown` post-compaction state with stronger evidence.
