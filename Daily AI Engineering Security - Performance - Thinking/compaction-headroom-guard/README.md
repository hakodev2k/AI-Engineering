# Compaction Headroom Guard

**Category:** Token

## Problem
Long-running agent sessions can consume so much effective context that the compaction/recovery path no longer has enough headroom to operate reliably. This creates a deadlock where the session cannot continue and the mechanism intended to reduce context can also fail.

## Evidence
See `evidence/research.md`. Current signals include official OpenAI guidance to monitor usage and plan compaction ahead, plus Codex and Claude Code reports of compaction/resume failure when conversations reach effective limits.

## Existing approach
Automatic or manual compaction, context percentage indicators, `/compact`, `/clear`, and starting a new thread.

## Existing limitations
A primary model's context size does not necessarily equal the compactor's usable capacity; reactive thresholds ignore future tool-output growth; clearing history without a durable handoff can lose task state.

## Proposed improvement
Treat context as a capacity budget with explicit working, compaction, and recovery zones. Predict the next growth step and compact before reserved headroom is consumed. Maintain a durable task-state handoff so recovery does not depend on the oversized conversation.

## Architecture
```text
usage telemetry + expected growth
  -> effective capacity
  -> reserve compaction + recovery space
  -> classify safe / warn / compact-now / block-growth
  -> checkpoint critical state
  -> compact once
  -> re-measure + verify continuity
  -> failure: bounded retry or fresh-session recovery from handoff
```

## Actual package tree
```text
compaction-headroom-guard/
├── README.md
├── evidence/research.md
├── skills/manage-compaction-headroom.md
├── rules/compaction-budget-rules.md
├── subagents/headroom-verifier.md
├── workflows/measure-compact-recover.md
├── hooks/pre-context-growth.md
├── scripts/compaction_headroom.py
└── tests/test_compaction_headroom.py
```

## Installation
Python 3.10+ is sufficient for the calculator. Integrations should supply real provider/model usage metadata when available.

## Configuration
Choose values in the same token/context units:
- `capacity`: conservative effective capacity, preferably the minimum known usable primary/compactor limit;
- `compaction-reserve`: capacity intentionally protected for compaction;
- `recovery-reserve`: capacity protected for handoff/recovery operations;
- `warn-margin`: early-warning buffer before the hard working limit;
- `expected-growth`: measured or conservative next-turn/tool-output estimate.

## Usage
```bash
python scripts/compaction_headroom.py \
  --capacity 200000 \
  --used 130000 \
  --expected-growth 12000 \
  --compaction-reserve 30000 \
  --recovery-reserve 10000 \
  --warn-margin 10000
```

Exit codes: `0 safe`, `1 warn`, `2 compact-now`, `3 block-growth`, `4 invalid config`.

Run tests:
```bash
python -m unittest tests/test_compaction_headroom.py
```

## Workflow
Follow `workflows/measure-compact-recover.md`. Before `compact-now`, persist an external task-state artifact containing user constraints, verified facts, decisions, open tasks, risks, and verification status—never hidden chain-of-thought.

## Metrics
- compaction trigger headroom;
- compaction success rate;
- emergency clear/new-thread rate;
- input/output tokens per task;
- recovery token cost;
- compaction latency/cost;
- quality/regression rate after compaction;
- critical-state recovery completeness.

## Verification
1. Unit tests cover all threshold states.
2. Replay real usage traces around the configured boundary.
3. Confirm a projected large tool output triggers before consuming reserve.
4. Verify one controlled compaction reduces usage enough to return to `safe` or `warn`.
5. Simulate compaction failure and recover from the durable handoff without requiring the oversized conversation.
6. Verify no critical requirement/security constraint is removed merely for token savings.

## Safety
Token optimization is subordinate to correctness and security. Do not delete essential requirements, approvals, provenance, unresolved risks, or verification evidence to satisfy a budget.

## Failure handling
Retry compaction at most once and only after materially reducing input or proving a transient provider failure. Otherwise recover into a fresh session from the durable handoff plus targeted retrieval.

## Definition of Done
Evidence documented; baseline measured; effective capacity/reserves configured; deterministic threshold tests pass; compaction occurs before reserve exhaustion; fallback handoff works; before/after usage is measured; continuity verified; no critical context loss detected.

## Customization
Calibrate reserves by model/provider, tool-output distribution, compaction implementation, and workload. Teams can maintain per-workflow p95 growth profiles rather than one global threshold.
