# Context Compaction Integrity Guard

## Topic
Context Compaction Integrity Guard

## Category
Token / Thinking

## Problem
Automatic context compaction can appear successful while losing admitted messages, reviving completed work, leaking reference summaries into the active turn, failing to reclaim tokens, or entering retry loops that worsen overflow.

## Evidence
See `evidence/research.md` for current August 2026 signals from Hermes, Prime Agent, and OpenClaw issue reports.

## Existing approach
Most runtimes trigger compaction at a token threshold, summarize older content, retain a recent tail, and retry transient summarizer failures.

## Existing limitations
Summarizer completion does not prove state continuity or token reclamation. Concurrent messages may race with snapshot creation, reference-only summaries can acquire active-turn authority, and persistence can diverge from in-memory state.

## Proposed improvement
Treat compaction as a transactional state transition with explicit invariants: stable message IDs, frozen snapshot boundary, structured active-goal/fact/approval ledgers, post-snapshot tail reattachment, token-reclamation threshold, reference-only summary semantics, durable readback verification, bounded retries, and rollback.

## Architecture
```text
context threshold
  -> baseline manifest
  -> freeze snapshot_end_id
  -> compact closed snapshot
  -> reattach concurrent tail
  -> verify coverage + protected state + tokens
  -> persist candidate
  -> reload and verify
  -> independent review
  -> commit | rollback
```

## Package tree
```text
README.md
evidence/research.md
skills/verify-compaction-continuity.md
rules/compaction-integrity.md
subagents/compaction-verification-agent.md
workflows/transactional-context-compaction.md
hooks/pre-commit-compaction-gate.md
scripts/verify_compaction.py
config/policy.json
```

## Installation
Python 3.10+; verifier uses only the standard library.

## Configuration
`config/policy.json` defines minimum reclaimed ratio, maximum attempts, and required continuity invariants.

## Usage
Produce `before.json` and `after.json` manifests. `before.json` includes `admitted_message_ids`, `token_count`, and `protected_state_hashes`. `after.json` includes `represented_message_ids`, `tail_message_ids`, `token_count`, retained `protected_state_hashes`, `summary_reference_only`, `active_turn_source`, `persistence_readback_match`, `stale_goal_resurrection_count`, and `attempt`.

Run:
`python3 scripts/verify_compaction.py before.json after.json --policy config/policy.json --strict`

Exit 0 = commit candidate; exit 3 = rollback; exit 2 = invalid input/configuration.

## Workflow
Use `workflows/transactional-context-compaction.md`. The component creating the summary must not be the only verifier; use `subagents/compaction-verification-agent.md` after persistence readback.

## Metrics
Tokens/task, pre/post context tokens, reclaimed ratio, message coverage, protected-state retention, compaction latency, retry count, stale-goal resurrection count, and post-restart consistency.

## Verification
Implemented: workflow, policy, rules, hook, skill, verifier, and independent reviewer exist. Measured: capture before/after metrics for normal, concurrent-arrival, low-reclamation, persistence-mismatch, and stale-goal fixtures. Verified: coverage=100%, protected state retained, reclamation >= policy, reference-only semantics preserved, readback matches, retries <=2, stale resurrection=0.

## Safety
Compaction MUST NOT remove authorization, safety, approval, or active-task constraints merely to save tokens. Failed invariants retain the original context.

## Failure handling
Detection: verifier nonzero exit or independent review failure. Evidence: preserve manifests and metric report. Retry: maximum two attempts, with changed payload/strategy on attempt two. Fallback: keep original context or migrate to a new session with explicit handoff. Escalation: human/operator review. Stop: missing admitted messages, lost protected state, failed readback, or exhausted retry budget.

## Definition of Done
- Current evidence documented.
- Snapshot boundary and stable IDs implemented.
- Structured protected state external to summary text.
- Before/after token metrics captured.
- 100% admitted-message coverage verified.
- Required reclamation measured.
- Persistence readback verified.
- Stale-work regression passes.
- Retries bounded.
- Independent verification complete.
- No blocking issue remains.

## Customization
Tune reclamation thresholds by model/context size, but never weaken message coverage, protected-state retention, authorization, or persistence checks to reduce cost.
