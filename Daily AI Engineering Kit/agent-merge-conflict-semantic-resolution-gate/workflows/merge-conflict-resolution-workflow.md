# Merge Conflict Semantic Resolution Workflow

## Trigger
A merge, rebase, cherry-pick, revert, or branch integration produces conflicts that require semantic resolution.

## Entry conditions
- Integration operation is known.
- Worktree contains the intended conflict set only.
- Current revision/state is captured.

## Inputs
Repository/worktree, conflict policy, relevant requirements/PR/commit context, tests/build tools.

## Flow

```text
Trigger
  ↓
Inventory conflicts
  ↓
Capture side signatures
  ↓
Inspect both intents
  ↓
Create resolution decisions
  ↓
Resolve one conflict at a time
  ↓
Run targeted checks
  ↓
Deterministic evaluation
  ↓
Independent review if required
  ↓
Final fingerprint gate
  ↓
Broader repository verification
  ↓
Complete
```

## Stages
1. **Inventory — Conflict Analyst**: run `scripts/scan-conflicts.py`.
2. **Signature capture — Conflict Analyst**: run `scripts/capture-side-signatures.py`.
3. **Semantic investigation**: follow `skills/inspect-conflict-semantics.md` and produce decisions matching `schemas/resolution-decision.schema.json`.
4. **Resolution**: follow `skills/resolve-conflict-with-evidence.md`; avoid unrelated refactoring.
5. **Targeted checks**: execute every check declared for every conflict and preserve output.
6. **Deterministic evaluation**: run `scripts/evaluate-resolution.py`. `blocked` cannot be reviewed away.
7. **Independent review**: required when report says `review-required` or conflict risk is high/critical.
8. **Final gate**: run `scripts/verify-final-gate.py` with exact inventory/policy/report/review.
9. **Repository verification**: build/test/static-analysis appropriate to affected components.
10. **Completion**: record remaining risks and approval status.

## Checkpoints
- Inventory and signatures captured before edits.
- One decision exists per conflict.
- Zero conflict markers remain.
- Targeted checks executed for exact resolved state.
- Report fingerprints match current inventory/policy.
- Required independent review matches exact report.

## Retry rules
- Transient read/tool failure: maximum 1 retry; preserve original error.
- Resolution remediation after deterministic/test/review findings: maximum 1 cycle.
- Deterministic blocker: no automatic retry until underlying state changes.
- Permission/environment failure: stop and escalate; never broaden permissions silently.
- New conflict set after base movement: discard stale evidence and regenerate inventory.

## Approval points
Stop for explicit human approval before production deployment, destructive SQL, database schema changes, data/file deletion, force push/history rewrite, infrastructure/secret/production config changes, breaking APIs, security weakening, irreversible migrations, or large dependency upgrades.

## Failure paths
- Unknown business intent → owner/domain escalation.
- Test failure → preserve evidence and one remediation cycle maximum.
- Review changes requested → one remediation cycle, then re-evaluate and obtain a new fingerprint-bound review.
- Repeated failure → stop with unresolved findings.

## Definition of Done
- Every conflict is inventoried and has a resolution decision.
- No conflict markers remain.
- Declared preserved-side evidence is consistent with the resolved file.
- Targeted checks ran for every conflict.
- Deterministic report is not blocked.
- Required independent review is approved and current.
- Final gate returns `verified`.
- Broader build/tests appropriate to affected scope have run separately.
- Required human approvals are satisfied before dangerous actions.
- Remaining risks/open questions are documented.
