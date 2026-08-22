# Compaction Read Ledger Continuity Guard

**Category:** Token  
**Research date:** 2026-08-21 (UTC+7)

## Problem
Long agent sessions can repeatedly carry unchanged tool payloads through model history and re-read the same files after compaction when read/dedup state is transient. This increases tokens and latency without adding evidence.

## Evidence
See `evidence/research.md`. A 2026-08-12 Hermes Agent report describes post-compaction loss of `read_file` dedup state and cache-read/input ratios around 15–18×. A separate 2026-07-01 Codex issue describes large command results bloating model-visible context. The package treats these as signals to measure replay rather than assuming all repeated context is waste.

## Existing approach
Output truncation, compaction, in-memory read tracking, prompt caching, partial reads, and manual filtering.

## Existing limitations
Single-output bounds do not prevent repeated transmission. In-memory read state can disappear during compaction. Prompt caching does not guarantee lower logical context occupancy or preserve the agent's artifact-awareness across state reconstruction.

## Proposed improvement
Persist a compact content-addressed read ledger across compaction. Use artifact key + content/version hash to distinguish unchanged reuse from changed evidence. Return lightweight references/bounded previews for already-captured unchanged content and measure duplicate replay before and after optimization.

## Architecture
The analysis skill defines an evidence-driven procedure; invariants protect correctness; Context Profiler establishes the baseline; Verification Agent independently validates quality and savings; two bounded workflows handle optimization and compaction recovery; the post-compaction hook runs a deterministic replay profiler; tests cover unique, duplicate, cache-ratio, and invalid-hash cases.

## Package tree
```text
README.md
config/budget.json
evidence/research.md
hooks/post-compaction-ledger-check.md
rules/context-reuse-invariants.md
scripts/read_replay_guard.py
skills/replay-amplification-analysis.md
subagents/context-profiler.md
subagents/verification-agent.md
tests/test_read_replay_guard.py
workflows/compaction-recovery.md
workflows/profile-optimize-verify.md
```

## Installation
Requires Python 3.10+ and the standard library only. Integrate trace collection in the target agent runtime so file/tool reads include stable artifact identity, content hash, turn, and token estimate.

## Configuration
`config/budget.json` defines replay thresholds. Tune them only from representative baseline data and quality requirements; do not loosen a threshold after observing a failing optimization merely to claim success.

## Usage
Example trace:

```json
{
  "compaction_turns": [5],
  "events": [
    {"turn": 1, "artifact": "src/a.py", "content_sha256": "abc", "tokens": 1000},
    {"turn": 6, "artifact": "src/a.py", "content_sha256": "abc", "tokens": 1000}
  ],
  "provider_usage": [
    {"input_tokens": 1000, "cache_read_tokens": 12000}
  ]
}
```

Run:

```bash
python scripts/read_replay_guard.py trace.json --config config/budget.json
python -m unittest tests/test_read_replay_guard.py
```

Exit `0` passes budget, `2` means invalid measurement input, and `3` means replay budget exceeded.

## Workflow
Use `workflows/profile-optimize-verify.md` for diagnosis and before/after measurement. Use `workflows/compaction-recovery.md` when designing state rehydration. Optimization is bounded to two distinct hypotheses and ledger-load correction to one retry.

## Metrics
- Duplicate same-content read token ratio.
- Post-compaction duplicate unchanged reads.
- Duplicate tokens/task.
- Cache-read/input ratio when available.
- Total tokens/task and latency/task.
- Task quality/correctness pass rate and regression rate.

## Verification
**Implemented:** profiler, thresholds, rules, procedures, workflows, hook, and deterministic regression tests are present.  
**Measured:** the profiler emits unique/duplicate counts, duplicate token ratio, post-compaction duplicates, and cache-read/input ratio.  
**Verified:** a target optimization is verified only when the same representative workload shows improved replay metrics and non-regressed quality; this repository package alone does not claim production savings.

## Safety and correctness
Never reuse based on path alone. A matching content/version hash is required. Changed or uncertain artifacts must be read as needed. Required evidence is retained even if that exceeds the token target. The package optimizes redundant unchanged content, not correctness-critical context.

## Failure handling
Detect failures through non-zero profiler/tests or task-quality regression. Preserve before/after traces. Try at most two evidence-driven optimization hypotheses. If reliable artifact identity/version cannot be established, retain the original safe context behavior and escalate rather than perform unsafe eviction.

## Definition of Done
Current evidence documented; baseline captured; replay root cause identified; durable ledger/reuse mechanism implemented in target runtime; tests pass; before/after tokens and latency measured; changed-content behavior correct; quality non-regressed; independent verification complete; no blocking issue remains.

## Customization
Adapters may derive artifact keys and hashes from filesystem metadata, Git blob IDs, API entity versions, or tool-result digests. Keep identity/version checking deterministic and keep framework-specific storage outside model-visible history where practical.
