# New Data Product Workflow

**Trigger:** approved need for a new analytical/operational dataset.

1. Intake: goal, owner, consumers, decisions supported, SLA and classification.
2. Contract: run `skills/data-contract-engineering.md`.
3. Parallel discovery: source profiling, lineage impact, reliability/capacity and security constraints.
4. Design ingestion and transformation; identify sequential dependencies.
5. Implement deterministic logic, checkpoints and metadata.
6. Validate schema and data-quality gates.
7. Rehearse failure/restart and sample replay.
8. Review cost, observability, lineage and handoff.
9. Obtain human approval for applicable gates.
10. Release incrementally when possible.
11. Verify consumer-readable output, freshness and reconciliation.
12. Handoff runbook/ownership.

**Retry:** max configured retries for transient infrastructure actions; deterministic failures return to correction stage.

**DoD:** contract, quality evidence, lineage, monitoring, recovery, owner and consumer acceptance are present.
