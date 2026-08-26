# Checkpoint Side-Effect Reconciliation Gate

**Category:** Thinking

## Problem
Long-running AI agents can restore stale or compacted conversational state while repositories, files, deployments, messages, billing records, DNS, migrations, or other durable systems remain newer. Continuing from memory alone can repeat already-completed work or duplicate irreversible actions.

## Evidence
See `evidence/research.md` for current August/July 2026 Codex reports and durable-execution guidance.

## Existing approach
Checkpoint restoration, context compaction, durable workflow persistence, idempotency keys, and manual confirmation are common controls.

## Existing limitations
Agent memory and external side effects live in different durability domains; summaries can lose exact execution frontier; not every tool exposes idempotency; write authority is often restored before current external state is verified.

## Proposed improvement
Treat every resume/compaction/recovery event as a mutation-authority boundary. Reconcile restored checkpoint state with current durable state and side-effect receipts before allowing writes.

## Architecture
```text
checkpoint-side-effect-reconciliation-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-mutation-resume-check.md
├── rules/resume-authority.md
├── scripts/reconcile_resume.py
├── skills/resume-reconciliation.md
├── subagents/reconciliation-verifier.md
├── tests/test_reconcile_resume.py
└── workflows/reconcile-and-resume.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` to define high-risk operations, acceptable reconciliation states, maximum retries and human-approval requirements. Do not relax reconciliation for convenience.

## Usage
1. Persist checkpoint sequence/frontier and completed operation ids.
2. Capture current external-world sequence/fingerprint and durable receipts.
3. Run:
   `python scripts/reconcile_resume.py --checkpoint checkpoint.json --world world.json --ledger ledger.json --policy config/policy.json`
4. Permit mutation only on exit 0 with `mutation_allowed=true`.

## Workflow
Follow `workflows/reconcile-and-resume.md`: Observe → Measure → Diagnose → Hypothesize → Repair metadata only when evidence supports it → Measure again → Independent verification → Resume.

## Metrics
- Duplicate durable side effects: target 0.
- Unexplained world-ahead resumes reaching mutation: target 0.
- High-risk receipt coverage: target 100%.
- Reconciliation retries: <=2.
- Repeated-work rate after resume: lower than baseline.

## Verification
Run `python -m unittest tests/test_reconcile_resume.py`. The independent verifier must confirm current durable evidence, not merely the restored summary.

## Safety
Fail closed on missing or unexplained durable state. Never repeat a mutation to discover whether it succeeded. Never log reusable credentials. Require human approval for unresolved high-risk divergence.

## Failure handling
**Detection:** non-zero script exit, fingerprint mismatch, world-ahead sequence, missing receipt.  
**Evidence:** checkpoint, current state fingerprint, operation receipts.  
**Retry policy:** maximum 2 read-only reconciliation attempts.  
**Fallback:** read-only mode.  
**Escalation:** human owner for high-risk or unexplained state.  
**Stop condition:** unresolved divergence, missing high-risk evidence, secret exposure, or exhausted retries.

## Definition of Done
**Implemented:** pre-mutation gate, policy and ledger integration active.  
**Measured:** before/after resume metrics and discrepancy counts captured.  
**Verified:** tests pass; independent reviewer confirms durable state matches accepted execution frontier; no duplicate side effect, no blocking issue, no secret exposure.

## Customization
Add adapters that compute durable fingerprints or query provider receipts. Keep the invariant: unverified restored state does not imply mutation authority.
