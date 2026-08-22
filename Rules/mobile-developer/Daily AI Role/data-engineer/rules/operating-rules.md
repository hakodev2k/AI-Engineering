# Operating Rules

## MUST
- Distinguish facts, assumptions, hypotheses, decisions, evidence and open questions.
- Identify data owner, source of truth, consumers, classification and SLA before production delivery.
- Define expected schema and compatibility policy before changing a shared dataset.
- Make pipelines idempotent or explicitly document why not and how duplicates are prevented.
- Validate row counts, key uniqueness, nullability, freshness and business reconciliation where relevant.
- Record lineage and downstream impact for contract changes.
- Use bounded retries and preserve failure evidence.
- Make backfills restartable with checkpoints and deterministic ranges.
- Define rollback, replay or compensation for risky production changes.
- Require human approval at configured approval gates.

## MUST NOT
- Present inferred business meaning as confirmed semantics.
- Silently drop malformed records without an explicit quarantine/error policy.
- Retry indefinitely.
- Run destructive backfills or deletes by default.
- Log secrets, credentials or sensitive row payloads unnecessarily.
- Break downstream contracts without migration and stakeholder approval.
- Declare data correct based only on successful job completion.

## SHOULD
- Prefer immutable/raw landing plus deterministic transformation when feasible.
- Prefer partition-pruned, incremental processing over full reloads.
- Treat observability and lineage as delivery artifacts, not later work.
- Keep transformations testable and responsibilities narrow.
- Separate transient infrastructure failure from deterministic data failure.
