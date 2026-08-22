# Context Compaction Retry Debris Breaker

**Category:** Token / Performance

## Problem
Long-running agents can make context-overflow recovery worse when failed compaction diagnostics are persisted into the same history that the next compaction attempt summarizes. The next request grows, fails again, persists more debris, and can become permanently unresponsive.

## Evidence
See `evidence/research.md`. The package is grounded in recent August 2026 public reports from Prime Agent and Hermes Agent covering self-amplifying compaction retries, stale compaction handoffs, and silent summary continuity loss.

## Existing approach
Most runtimes compact after a threshold, retry failures, retain a recent tail, and optionally reuse a previous summary.

## Existing limitations
Count-only retries do not prove that the new payload is smaller or different. Retry/debug records may pollute semantic history. A replacement summary may silently lose completed work or revive stale tasks.

## Proposed improvement
Create an explicit compaction boundary: classify semantic vs operational artifacts, enforce an independent compaction input ceiling, require material payload reduction or strategy change for retries, preserve the last verified summary, and independently verify continuity before replacement.

## Architecture

```text
context-compaction-retry-debris-breaker/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-compaction-gate.md
├── rules/compaction-safety.md
├── scripts/compaction_guard.py
├── skills/compaction-recovery-analysis.md
├── subagents/compaction-verifier.md
├── tests/fixtures.json
└── workflows/recover-compaction.md
```

## Installation
Requires Python 3.10+ only; the deterministic guard uses the standard library. Copy this package into an agent repository and wire the pre-compaction hook into the runtime immediately before summary generation/retry.

## Configuration
Edit `config/policy.json`. Set the character ceiling below the provider's effective context limit after reserving output and system-instruction headroom. Keep retries bounded. Extend `exclude_kinds` to match runtime-specific diagnostic metadata.

## Usage
Prepare a candidate manifest containing message kinds/sizes and retry metadata, then run:

```bash
python scripts/compaction_guard.py candidate.json --policy config/policy.json --strict
```

Exit codes: `0` allowed, `2` invalid input/config, `3` blocked by policy.

## Workflow
Follow `workflows/recover-compaction.md`: Observe → Measure → Diagnose → Hypothesize → Build bounded candidate → Preflight → Retry within budget → Independently verify → Commit recovered state.

## Metrics
Track compaction input size, excluded debris size, retry count, payload reduction ratio, continuity-field coverage, and recovery latency. Do not claim improvement until a failing fixture demonstrates bounded termination/recovery.

## Verification
Use `tests/fixtures.json` to construct three regression cases: productive bounded input must pass; retry-debris input must block; a materially smaller changed-strategy retry must pass. Add project-specific integration tests that verify the old summary remains available until its replacement passes continuity checks.

## Safety
This package never recommends deleting session history to make a retry succeed. Destructive resets require human approval. Token reduction must not remove accepted constraints, security boundaries, critical facts, completed work, or unresolved blockers.

## Failure handling
Detection: preflight violation or failed continuity check. Evidence: persist manifest and guard result outside semantic history. Retry: maximum 2. Fallback: last verified summary + bounded recent semantic tail. Escalation: stop automation and request human recovery for destructive changes. Stop condition: exhausted retry budget, unbounded candidate, or repeated continuity failure.

## Definition of Done
- **Implemented:** the pre-compaction gate executes on every compaction attempt.
- **Measured:** before/after payload size, excluded debris, and retry metrics are captured.
- **Verified:** loop fixture terminates within bounded attempts; productive fixture is not blocked; previous verified summary survives continuity failure; no excluded debris enters the compaction request.

## Customization
Map runtime-specific message metadata into `kind`; replace character sizing with a model-specific token counter if available; tune ceilings from measured production headroom rather than guessing.
