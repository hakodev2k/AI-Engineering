# Migration Hooks

## PreTask
**Trigger:** migration workflow starts.

**Preconditions:** migration source path and policy path are known.

**Action:** confirm files exist, target DB/engine is declared, and working tree context is understood.

**Command:** host-specific repository checks plus read-only file validation.

**Expected result:** workflow inputs are present.

**Failure behavior:** blocking; do not infer missing target/environment.

## PostSqlGeneration
**Trigger:** migration SQL is generated or updated.

**Action:** run deterministic inspection.

**Command:**
```bash
python scripts/inspect-migration.py --migration <sql-file> --policy config/migration-policy.json --output <inspection.json>
```

**Expected result:** JSON inspection artifact exists.

**Failure behavior:** exit 3/tool error blocks. Risk findings are forwarded to analysis/review and cannot be silently discarded.

## PreReview
**Trigger:** analyst claims evidence package is ready.

**Action:** validate manifest.

**Command:**
```bash
python scripts/validate-migration-manifest.py --manifest <manifest.json> --policy config/migration-policy.json
```

**Expected result:** exit 0.

**Failure behavior:** exit 2 returns to analyst within bounded revision count; exit 3 blocks.

## PreProductionApproval
**Trigger:** reviewer returns `pass` for a production migration.

**Action:** verify manifest status is `reviewed`, exact migration reference/hash is present, destructive findings are declared, and required approval fields are not falsely marked completed.

**Command:** run manifest validator again.

**Failure behavior:** blocking.

## PreApply
**Trigger:** authorized deployment process is about to execute the approved migration.

**Action:** revalidate manifest and compare the exact approved migration artifact/revision with the reviewed reference.

**Expected result:** no drift between reviewed and applied migration.

**Failure behavior:** blocking; changed migration requires new review/approval.

## PostApply
**Trigger:** external deployment reports migration execution complete.

**Action:** execute only the predeclared verification queries/tests through the authorized environment and record evidence.

**Expected result:** all required postconditions pass.

**Failure behavior:** status remains `applied` or becomes `blocked`; never promote to `verified`. Use only approved recovery/forward-fix procedure.

## PreComplete
**Trigger:** agent attempts to declare success.

**Action:** run validator and confirm lifecycle status is `verified` when production execution is in scope.

**Failure behavior:** blocking.