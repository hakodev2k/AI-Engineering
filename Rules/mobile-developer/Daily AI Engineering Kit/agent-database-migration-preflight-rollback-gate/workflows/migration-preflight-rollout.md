# Migration Preflight and Rollout Workflow

```text
Trigger -> Context -> Plan -> Static Gate
                       | blocked -> revise <= 2 times -> stop/escalate
                       | approval_required -> verifier -> human approval
                       | passed -> verifier
Verifier -> authorized external execution -> post-checks -> verified
                                      | failure -> recovery workflow -> verify
```

## Trigger
An application or operations change requires a schema change, index/constraint operation, data backfill, rename, or coordinated database migration.

## Entry conditions
Target environment and database engine are known; repository migration mechanism is identified; policy is available; execution authority is separate from planning authority.

## Inputs
Change request, migration code/files, current schema and migration history, rollout order, row estimates, `config/policy.json`, and plan artifact.

## Stages
1. **Context — Migration Planner:** locate models, migrations, database entry points, deployment order, and nearby tests.
2. **Plan — Migration Planner:** create the structured plan, classify operations, define timeouts, rollout stages, rollback/compensation, and verification checks.
3. **Gate — deterministic:** run `python scripts/migration_gate.py --plan <plan.json> --policy config/policy.json --output gate-result.json`.
4. **Checkpoint:** exit 2 blocks. Exit 4 requires explicit approval. Exit 0 means only that the plan passes configured static checks.
5. **Independent review — Migration Verifier:** reproduce the gate and challenge compatibility, scope, recovery, and verification assumptions.
6. **Approval:** required operations must have a human approval reference bound to the exact plan/environment. Material edits invalidate approval.
7. **Authorized execution:** production migration is performed only by the external authorized deployment/operator mechanism.
8. **Post-verification — Migration Verifier:** check migration history, schema, invariants, smoke tests, and monitoring evidence.
9. **Recovery:** if execution is partial or verification fails, invoke `skills/migration-recovery.md`; never automatically repeat data-changing recovery.
10. **Complete:** status becomes verified only when postconditions are proven.

## Produced artifacts
Migration plan, gate result, approval reference when required, execution/log reference, verification evidence, and recovery evidence if used.

## Checkpoints
- Before gate: plan and environment are explicit.
- Before approval: exact plan is frozen for review.
- Before execution: verifier has no blocking finding.
- After execution: post-verification is mandatory.

## Retry rules
- Static gate/tool transient failure: one retry with unchanged inputs.
- Plan correction for genuine validation findings: maximum two revisions; each returns to Gate.
- Read-only verification transient failure: one retry.
- Data-changing execution/recovery failure: no automatic retry; stop and assess state.

## Approval points
Production operations reported by the gate as approval-required, any destructive or data-loss-capable recovery, production configuration changes, migration policy changes, schema changes outside the approved plan, and irreversible actions.

## Failure paths
Unknown environment -> stop. Gate unavailable -> stop. Blocked plan -> revise up to two times, then escalate. Missing approval -> stop. Plan changed after approval -> invalidate approval. Partial migration -> recovery skill. Failed post-verification -> stop and escalate.

## Definition of Done
Exact plan was gated; independent review passed; required approval targets the exact plan/environment; authorized execution evidence exists; migration history/schema/data/application checks pass; no blocking risk remains; residual risk is documented.
