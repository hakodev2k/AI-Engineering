# Workflow: Consensus Resolution

## Trigger
Two or more agents produce incompatible recommendations that block planning, implementation, review, verification, release, or incident response.

## Entry conditions
- The disagreement is material to the task.
- At least two distinct participants exist.
- Current task/repository revision is known.

## Inputs
Participant positions, evidence inventory, risk, repository/task revision, `config/consensus-policy.json`.

## Flow
```text
Trigger
  ↓
Structure disagreement
  ↓
Validate contract
  ↓
Apply deterministic policy
  ↓
Resolved? ── yes → verify resolution
  │
  no
  ↓
Collect smallest evidence delta
  ↓
Evaluate progress/deadlock
  ↓
Progress? ── no → human-decision-required
  │
  yes
  ↓
Next bounded round
  ↓
High risk? ── yes → independent Consensus Verifier
  │                     ↓
  no                    review
  └──────────────→ final consensus gate
```

## Stages
1. **Structure** — Disagreement Coordinator records one narrowly scoped subject, positions, evidence IDs, risk, round, and fingerprint.
2. **Validate** — run `python scripts/validate-disagreement.py <record>`.
3. **Policy check** — mandatory repository/security/business rules may resolve the conflict without another debate round.
4. **Evidence plan** — identify the smallest tests/queries/reads capable of falsifying competing claims.
5. **Evidence acquisition** — run only approved, non-destructive actions. Dangerous or production actions require explicit human approval before execution.
6. **Progress check** — run `scripts/evaluate-deadlock.py` against the prior round.
7. **Bounded round** — maximum rounds come from policy; after round 1, continued debate requires new evidence.
8. **Independent review** — required for high/critical risk.
9. **Final gate** — run `scripts/evaluate-final-gate.py`; only `verified` may return to the parent workflow as resolved.

## Checkpoints
- Valid structured disagreement
- Evidence delta captured
- Deadlock evaluator passes or escalates
- High-risk review fingerprint matches
- Final gate returns `verified`

## Retry rules
- Transient tool/read failure: maximum 1 retry.
- Validation failure: no automatic retry; fix the record.
- Semantic disagreement: no retry without new evidence.
- Permission failure: stop; never increase permissions automatically.

## Approval points
Explicit human approval is required before production deployment, destructive database/file operations, infrastructure/secret/config changes, force-push/history rewrite, breaking contracts, irreversible migration, or weakening security.

## Failure paths
- No evidence progress → `human-decision-required`.
- Max rounds exceeded → `human-decision-required`.
- Stale review fingerprint → `blocked` until re-review.
- Required evidence unavailable safely → `human-decision-required` or `blocked`.
- Mandatory rule violated → `blocked`.

## Definition of Done
- Exact disagreement subject and participants recorded.
- Evidence and revisions preserved.
- No infinite debate loop occurred.
- Resolution mode and reason are explicit.
- High-risk work has independent verification.
- Final gate is `verified`, or the workflow stops with an explicit non-success status.
