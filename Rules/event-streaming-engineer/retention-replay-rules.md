# Retention and Replay Rules

## Purpose
Ensure retained streams support recovery, audit, and reprocessing without uncontrolled cost or side effects.

## Scope
Applies to time/size retention, compaction, archival, replay, backfill, and consumer offset resets.

## MUST
- Retention MUST be derived from recovery, replay, compliance, consumer outage, and cost requirements.
- Compaction keys and tombstone semantics MUST match the intended state reconstruction model.
- Replay procedures MUST define scope, ordering expectations, idempotency, downstream side effects, and rate limits.
- Historical events required for replay MUST remain deserializable with supported schemas.
- Production replay or offset reset MUST require human approval and an explicit blast-radius plan.

## MUST NOT
- MUST NOT reduce retention below documented recovery requirements without approval.
- MUST NOT assume replay is safe merely because normal consumption is safe.
- MUST NOT replay into side-effecting sinks without duplicate-effect analysis.
- MUST NOT delete archived event data subject to retention obligations without authorization.

## SHOULD
- Replay SHOULD use isolated consumer identities or destinations when validation is needed before applying effects.
- Retention cost SHOULD be reviewed against actual recovery value.

## Exceptions
Emergency replay may use expedited approval but still requires target boundaries, operator identity, monitoring, and post-action reconciliation.

## Verification
Inspect broker policies, archive lifecycle configuration, schema availability, replay tests, dry-run output, audit logs, and recovery exercises.