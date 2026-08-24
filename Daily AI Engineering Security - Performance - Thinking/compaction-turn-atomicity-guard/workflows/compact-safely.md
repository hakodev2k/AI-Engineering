# Workflow — Safe Compaction Boundary
## Trigger
Automatic/manual context compaction or a history/checkpoint rewrite.
## Goal
Compact only after the turn and all tool effects are durably resolved.
## Inputs
Current turn snapshot, policy, checkpoint target.
## Baseline
Capture current lost-effect, duplicate-effect, stale-resume and unresolved-at-compaction counts.
## Stages
1. **Observe** — snapshot turn/tool states before compaction.
2. **Measure baseline** — record current unsafe-compaction incidence.
3. **Diagnose** — identify unresolved or semantically ambiguous state.
4. **Form hypothesis** — choose barrier/idle-boundary/reconciliation change.
5. **Implement improvement** — runtime owner changes compaction scheduling/state handling.
6. **Measure again** — exercise safe and unsafe fixtures plus representative long sessions.
7. **Verify** — independent agent checks structured state and post-compaction identity.
## Responsible agent
Boundary analyst diagnoses; runtime owner implements; Verification Agent signs off.
## Tools
`check_turn_state.py`, unit/integration tests, durable state store inspection.
## Outputs
Gate report, before/after metrics, verification decision.
## Checkpoints
Pre-compaction gate; durable executor completion; checkpoint commit; post-compaction identity check.
## Metrics
Defined in `evidence/research.md`.
## Retry policy
Maximum 2 compaction retries. Before every retry, re-read the latest snapshot and rerun the gate.
## Stop conditions
Any unresolved tool, missing correlation evidence, identity drift, failed checkpoint, or retry limit exhaustion.
## Failure path
Keep original history; do not compact; reconcile uncertain external effects; escalate if state cannot be proven.
## Verification
Both structural tests and representative runtime traces must show zero unresolved tools at committed compaction.
## Definition of Done
Evidence documented; baseline captured; gate implemented; tests pass; before/after metrics captured; independent verification complete; no blocking uncertainty remains.
