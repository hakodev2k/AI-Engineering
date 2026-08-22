# Session Metadata Reinjection Dedup Guard

**Category:** Token

## Problem
Long-running coding-agent sessions can persist transient hook results, progress records, reminders, prompt copies, snapshots, bootstrap material, and subagent side-events. If history reconstruction replays redundant persisted metadata into later model turns, prompt size can grow faster than useful conversation state, increasing token cost, latency, compaction pressure, and context-loss risk.

## Evidence
`evidence/research.md` records recent public issue evidence from Claude Code and OpenClaw showing repeated session metadata/context inclusion, bootstrap reinjection, inflated session token accounting, premature compaction, and long-session degradation.

## Existing approach
Common mitigations are automatic compaction, `/clear`/new sessions, prompt caching, token counters, smaller bootstrap files, and persisting all events for recovery/debugging.

## Existing limitations
Persistence and per-turn replay are often coupled. Compaction may shrink conversational messages while leaving transient/session metadata replayable. Prompt caching does not recover context capacity, and cumulative token counters may not reflect the next reconstructed prompt. Deleting metadata indiscriminately can break correctness or recovery.

## Proposed improvement
Measure session composition first, classify records by lifecycle, fingerprint exact canonical duplicates, enforce an explicit metadata budget, and separate persisted audit/recovery state from the smaller replay working set. Unknown records remain protected until reviewed. Savings are accepted only when protected-state retention and representative task quality remain at configured thresholds.

## Architecture
- **Evidence** documents current public signals and the engineering gap.
- **Budget policy** defines protected, superseding, and ephemeral event classes plus measurable thresholds.
- **Skill** provides an evidence-driven profiling procedure.
- **Rules** enforce persistence-versus-inclusion separation and quality safeguards.
- **Subagent** independently verifies the candidate working set.
- **Workflow** implements bounded Measure → Diagnose → Optimize → Verify loops.
- **Hook** provides a deterministic pre-turn/regression budget check.
- **Profiler/tests** measure exact duplicate pressure and validate safe classification behavior.

## Package tree
```text
session-metadata-reinjection-dedup-guard/
├── README.md
├── config/
│   └── budget.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-turn-budget.md
├── rules/
│   └── session-context-rules.md
├── scripts/
│   └── session_bloat_profiler.py
├── skills/
│   └── profile-session-context.md
├── subagents/
│   └── context-analyst.md
├── tests/
│   └── test_profiler.py
└── workflows/
    └── measure-dedupe-verify.md
```

## Installation
Requires Python 3.9+ and no third-party packages. The profiler is read-only and expects JSONL where each non-empty line is a JSON object.

## Configuration
Edit `config/budget.json` to map runtime-specific event types. Keep unknown types protected by default until their semantics are reviewed. Tune the metadata byte budget and duplicate thresholds using representative sessions rather than arbitrary production suppression.

## Usage
Profile a session snapshot:

```bash
python scripts/session_bloat_profiler.py /path/to/session.jsonl --policy config/budget.json --json-out session-profile.json
```

Run regression tests:

```bash
python tests/test_profiler.py
```

Exit codes: `0` = within blocking thresholds; `2` = invalid session/config; `3` = metadata budget or exact transient-duplicate threshold exceeded.

## Workflow
Follow `workflows/measure-dedupe-verify.md`: capture an immutable baseline, measure event classes/duplicates, classify lifecycle, create a candidate replay working set, measure again, run quality/protected-state checks, and accept only verified improvement. Optimization loops are capped at two attempts.

## Metrics
Track total/session metadata bytes, exact duplicate bytes, candidate duplicate ratio, estimated prompt tokens, provider input tokens/task, cache metrics where available, latency/task, quality pass rate, and protected-state retention rate.

## Verification
### Implemented
The package contains the lifecycle policy, profiler, tests, enforceable rules, hook, workflow, skill, and independent verifier contract.

### Measured
The profiler reports record/byte distribution by event type, exact canonical duplicate groups, candidate redundant bytes, estimated tokens, unknown event types, and budget/duplicate decisions.

### Verified
An optimization is verified only when before/after replay cost improves, all protected state is retained or has an independently proven semantic replacement, representative quality tests meet policy, and an independent context analyst approves the final working set.

## Safety
The profiler never rewrites session logs. Do not delete permissions, approvals, user intent, safety/security events, or unknown state to satisfy a token budget. Work from snapshots/copies and keep persisted recovery/audit history separate from prompt-inclusion decisions.

## Failure handling
- **Detection:** profiler exit 2/3, retention failure, or task-quality regression.
- **Evidence:** preserve original/candidate profiles and relevant provider usage metrics.
- **Retry:** maximum two materially different optimization attempts.
- **Fallback:** restore the previous inclusion policy and protect uncertain types.
- **Escalation:** runtime owner when event semantics, recovery state, or accounting behavior is unclear.
- **Stop condition:** do not accept savings while required context, quality, or verification remains unresolved.

## Definition of Done
Current evidence is documented; baseline captured; event classes/lifetimes reviewed; duplicate/budget pressure measured; candidate inclusion policy implemented; before/after metrics collected; protected retention and quality thresholds pass; independent verification is complete; no required context is lost; no blocking issue remains.

## Customization
Map runtime-specific attachment/subtype names into `protected_types`, `superseding_types`, and `ephemeral_types`. Extend the profiler with a provider tokenizer or semantic supersession key only when it can be tested independently; exact canonical deduplication remains the safe default measurement.
