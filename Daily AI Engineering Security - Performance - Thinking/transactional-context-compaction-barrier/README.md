# Transactional Context Compaction Barrier

**Category:** Token

## Problem
Automatic context compaction can be triggered by incorrectly scoped token counters, can replace source history before it is durably stored, and can cross turns containing unresolved side effects. The result can be unnecessary token loss, silent tool-effect loss, repeated compaction failures, or unrecoverable summaries.

## Evidence
Current evidence and source links are in `evidence/research.md`.

## Existing approach
Most frameworks use token thresholds, generated summaries, provider usage counters, and retries. These controls optimize context size but do not consistently define a transaction boundary around durable history and tool side effects.

## Existing limitations
Thresholds are only trustworthy when token scope is explicit; synthetic summaries are not durable source history; in-flight side effects are not safe to compact across; unchanged failed compactions can repeat.

## Proposed improvement
Treat compaction as a transaction with a deterministic pre-commit barrier: verify `current_context` token scope, durable source-history checkpoint, zero unresolved side effects, bounded retries per transcript digest, and measurable post-compaction reduction.

## Architecture

```text
transactional-context-compaction-barrier/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-compaction.md
├── rules/
│   └── compaction-safety.md
├── scripts/
│   └── compaction_guard.py
├── skills/
│   └── compaction-transaction-analysis.md
├── subagents/
│   └── verification-agent.md
├── tests/
│   └── test_compaction_guard.py
└── workflows/
    ├── compact-safely.md
    └── failure-recovery.md
```

## Installation
Python 3.10+; no third-party packages are required.

## Configuration
Edit `config/policy.json` to set context-utilization threshold, minimum reduction ratio, retry budget, and your side-effecting tool names. Do not remove durability or unresolved-side-effect gates merely to improve throughput.

## Usage
Prepare an event JSON with `context_tokens`, `context_window`, `token_scope`, `history`, `history_checkpoint_durable`, `tool_calls`, and `retry_count_for_digest`, then run:

`python scripts/compaction_guard.py --event event.json --policy config/policy.json`

After generating a candidate, validate actual reduction with:

`python scripts/compaction_guard.py --event event.json --policy config/policy.json --verify-after 42000`

## Workflow
Follow `workflows/compact-safely.md`. If the gate rejects or post-check fails, use `workflows/failure-recovery.md`. All retries are bounded.

## Metrics
- Current-context utilization at trigger.
- Compaction reduction ratio.
- False/premature compaction trigger count.
- Blocks caused by unresolved side effects.
- Durable-history coverage before commit.
- Retries per history digest.
- Critical-fact retention/regression rate.

## Verification
Run `python -m unittest tests/test_compaction_guard.py`. An independent verifier must also confirm the source checkpoint exists, side effects are terminal, and task-critical facts survive the candidate.

## Safety
Original history remains recoverable until verification completes. The package never authorizes replay of an uncertain side effect. Irreversible recovery requires explicit human approval.

## Failure handling
**Detection:** deterministic exit code/reason plus verifier findings.  
**Evidence:** history digest, scoped counts, tool ledger, checkpoint status.  
**Retry policy:** maximum 2 attempts for one unchanged digest.  
**Fallback:** preserve original transcript and disable automatic compaction for that digest.  
**Escalation:** operator review for unknown side effects or hard context exhaustion.  
**Stop condition:** missing durability, exhausted retries, unknown external state, or failed verification.

## Definition of Done
**Implemented:** gate, rules, hook and workflows are integrated.  
**Measured:** before/after current-context tokens and blocker/retry metrics are captured.  
**Verified:** tests pass, minimum reduction is met, source history is durable, no unresolved side effect exists, critical facts remain, and no blocking issue remains.

## Customization
Add application-specific side-effecting tools and a semantic critical-fact verifier. Keep token-scope provenance and durability checks mandatory.
