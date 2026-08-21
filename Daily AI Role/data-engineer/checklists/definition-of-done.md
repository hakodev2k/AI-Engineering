# Definition of Done

A Data Engineer task is complete only when relevant items are evidenced:
- [ ] Goal, owner, consumers and source of truth are explicit.
- [ ] Contract/schema is valid and semantics are confirmed or open questions are resolved.
- [ ] Data classification and access constraints are addressed.
- [ ] Ingestion/transformation behavior is deterministic enough for supported replay.
- [ ] Idempotency/deduplication and checkpoint behavior are verified.
- [ ] Quality checks cover relevant correctness, completeness, freshness, uniqueness and reconciliation.
- [ ] Schema evolution and downstream impact are reviewed.
- [ ] Lineage/metadata are updated.
- [ ] Retries are bounded; deterministic failures are not blindly retried.
- [ ] Monitoring and actionable alerts exist.
- [ ] Recovery/backfill/rollback or compensation is defined.
- [ ] Cost/performance is within agreed limits.
- [ ] Human approvals are recorded for applicable gates.
- [ ] Handoff/runbook and ownership are clear.
- [ ] Verification evidence demonstrates consumer-usable output.
