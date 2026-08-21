# Artifact Integrity Hooks

## PostProduce
**Trigger:** after a stage finalizes a persisted artifact.
**Preconditions:** artifact path, task ID, repository ID, producer and type are known.
**Action:** register the artifact.
**Command:** `python scripts/register-artifact.py --artifact "$ARTIFACT_PATH" --record "$ARTIFACT_RECORD" --task-id "$TASK_ID" --repository-id "$REPOSITORY_ID" --producer "$PRODUCER" --artifact-type "$ARTIFACT_TYPE" --ttl-hours "${ARTIFACT_TTL_HOURS:-24}"`
**Expected result:** exit 0 and record with status `registered`.
**Failure:** block handoff.

## PreConsume
**Trigger:** before a downstream agent reads an artifact semantically.
**Action:** verify bytes/scope/freshness.
**Command:** `python scripts/verify-artifact.py --artifact "$ARTIFACT_PATH" --record "$ARTIFACT_RECORD" --policy config/artifact-policy.json --task-id "$TASK_ID" --repository-id "$REPOSITORY_ID"`
**Expected result:** exit 0.
**Failure:** block consumption; do not load artifact content.

## PreCommit
**Trigger:** before committing ledger/artifact changes.
**Action:** validate all records.
**Command:** `python scripts/check-artifact-ledger.py --ledger "${ARTIFACT_LEDGER_DIR:-.agent-artifacts/records}" --policy config/artifact-policy.json`
**Expected result:** no blocking violation.
**Failure:** block commit workflow step.

## PreComplete
**Trigger:** before declaring the multi-stage task verified.
**Action:** rerun ledger scan and ensure every high-trust consumed artifact has independent verification evidence.
**Command:** same ledger command as PreCommit.
**Failure:** task may be executed but must not be reported as verified.