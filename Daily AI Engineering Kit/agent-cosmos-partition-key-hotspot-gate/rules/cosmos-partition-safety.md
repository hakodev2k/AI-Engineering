# Cosmos Partition Safety Rules

## MUST
- Preserve evidence source and sampling window for every hotspot conclusion.
- Separate facts, hypotheses, decisions, evidence, and open questions.
- Use the same measurement method before and after remediation.
- Require explicit human approval before container recreation, partition-key change, bulk data migration, production throughput/config changes, or irreversible cutover.
- Keep tenant/security boundaries intact when proposing synthetic or composite keys.
- Verify functional correctness in addition to RU/latency improvement.
- Stop after two transient tool retries and preserve evidence.

## MUST NOT
- Do not infer a partition-key redesign from 429 responses alone.
- Do not run destructive SQL/data operations or delete/recreate Cosmos containers automatically.
- Do not expose connection strings, keys, tokens, or raw sensitive partition values in reports.
- Do not silently increase permissions, throughput, or production capacity.
- Do not call a task successful when only analysis or code generation completed.
- Do not hide an insufficient sample behind a `pass` result.

## SHOULD
- Prefer low-blast-radius fixes before repartitioning.
- Prefer redacted/hardened telemetry exports for offline analysis.
- Compare request share and RU share, not just absolute request count.
- Review retry storms, cross-partition queries, and scheduled fan-in before changing data model.
- Record rollback criteria before any approved production change.
