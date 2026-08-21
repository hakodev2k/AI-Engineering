# Pipeline Orchestration Rules
## Purpose
Ensure data workflows execute deterministically, recover safely, and expose operational state.
## Scope
Schedulers, DAGs, dependencies, retries, backfills, and workflow coordination.
## MUST
- Pipeline dependencies MUST be explicit and ordered from real data prerequisites.
- Retries MUST be bounded and MUST NOT duplicate irreversible side effects.
- Backfills MUST define scope, expected load, downstream impact, and rollback or correction strategy.
- Workflow state MUST expose success, failure, retry, and stale execution conditions.
## MUST NOT
- MUST NOT encode hidden execution dependencies in manual operator knowledge.
- MUST NOT rerun broad historical ranges without impact assessment.
## SHOULD
- Prefer idempotent tasks and partition-aware execution.
## Exceptions
Emergency reruns require bounded scope, evidence, and accountable approval.
## Verification
Review DAG definitions, retry configuration, backfill plans, execution history, and recovery tests.