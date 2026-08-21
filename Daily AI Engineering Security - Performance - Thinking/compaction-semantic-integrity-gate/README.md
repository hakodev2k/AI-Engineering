# Compaction Semantic Integrity Gate

## Topic
Compaction Semantic Integrity Gate

## Category
Thinking

## Problem
Long-running agents need compaction, but compressed context can silently mutate task state: fabricate user intent, reactivate completed work, drop pending work, alter approvals, or recursively preserve stale summaries. Token reduction alone does not prove semantic continuity.

## Evidence
See `evidence/research.md`. Current signals include multiple July–August 2026 Hermes Agent compaction bugs, an OpenAI Developer Community report about distorted approval/progress state after compression, and current OpenAI engineering guidance showing compaction is now a first-class primitive for long-running agents.

## Existing approach
Typical implementations summarize old turns, inject a provider-native compaction item or summary, optionally re-read static project instructions, and continue the session.

## Existing limitations
Free-form summaries are difficult to verify; dynamic state is often not externalized; summary provenance can be lost; recursive compaction can amplify earlier mistakes; and static instruction reloads do not restore live task/approval/checklist state.

## Proposed improvement
Externalize a compact, structured invariant ledger before compaction. After compaction, materialize the same schema and run a deterministic gate before the compacted state becomes authoritative. Critical changes require durable evidence. Failed candidates are regenerated from the last verified baseline with bounded retries.

## Architecture
- **Skill** defines evidence-driven integrity analysis.
- **Rules** define enforceable invariants.
- **Verifier subagent** independently accepts/rejects the candidate state.
- **Workflow** coordinates snapshot → compact → validate → recover/accept.
- **Hook** binds deterministic validation to the compaction boundary.
- **Script** performs machine-checkable state comparison.
- **Tests** cover common corruption classes.

## Package tree
```text
compaction-semantic-integrity-gate/
├── README.md
├── config/
│   └── integrity-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-compaction-state-snapshot.md
├── rules/
│   └── compaction-state-integrity.md
├── scripts/
│   └── compaction_integrity_gate.py
├── skills/
│   └── compaction-semantic-integrity-analysis.md
├── subagents/
│   └── context-integrity-verifier.md
├── tests/
│   └── test_compaction_integrity_gate.py
└── workflows/
    └── compaction-verification.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the package into the agent/project tooling repository. Integrate the hook at the application's compaction boundary.

## Configuration
Edit `config/integrity-policy.json` only to reflect explicit product policy. Do not weaken critical invariants to silence failures. Stable item IDs should be used for completed/pending work and verification requirements.

## Input state contract
The guarded state must include:
- `task_id`
- `active_goal`
- `language`
- `constraints` (array of stable IDs/strings)
- `completed_items`
- `pending_items`
- `approval_state`
- `verification_requirements`

If approval legitimately changes, the post-state should include a non-empty `approval_event_id` pointing to the durable authorization/revocation event.

## Usage
```bash
python scripts/compaction_integrity_gate.py \
  --before pre-state.json \
  --after post-state.json \
  --policy config/integrity-policy.json
```

Exit codes:
- `0`: allow
- `2`: invalid input/configuration
- `3`: block due to invariant failure

Run tests:
```bash
python -m unittest tests/test_compaction_integrity_gate.py
```

## Workflow
1. Snapshot durable task state and context size.
2. Run normal compaction.
3. Extract candidate post-state using the same schema.
4. Run deterministic gate.
5. Independently review critical findings.
6. If failed, retry from the original verified baseline up to policy limit.
7. Activate compacted state only after verification passes.

## Metrics
- Required-field preservation rate.
- Unsupported additions.
- Completed-to-pending regressions.
- Vanished pending items.
- Approval mismatches.
- Recovery retries.
- Context reduction ratio.
- Post-compaction task regression rate.

## Verification
### Implemented
The package provides structured policy, deterministic comparison, workflow, hook, independent verifier role, and executable regression tests.

### Measured
Projects adopting it must record pre/post context size and gate findings per compaction event.

### Verified
A compaction is verified only when the gate returns `allow`, regression tests pass, and any disputed critical state is independently reconciled with authoritative evidence.

## Safety
The gate validates observable state only and never requests hidden chain-of-thought. It does not grant approvals, execute destructive actions, or treat model-generated claims as authorization evidence.

## Failure handling
Detection is the non-zero gate result. Preserve pre/post snapshots and finding output. Retry a maximum of the configured count (default 2), always from the last verified baseline. If evidence is missing or a critical conflict remains, stop autonomous continuation and escalate to a human or trusted control plane.

## Definition of Done
- Current evidence documented.
- Baseline captured.
- Candidate compaction produced.
- Required fields preserved.
- No unsupported completion or goal mutation.
- No pending item silently lost.
- Approval transitions have evidence.
- Regression tests pass.
- Before/after context metrics captured.
- Independent verification complete for critical conflicts.
- No blocking issue remains.

## Customization
Extend protected fields for domain-specific state such as deployment environment, tenant, data classification, safety mode, release version, or active incident ID. Add transitions only when they can be backed by durable events and deterministic verification.