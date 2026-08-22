# Cosmos Hotspot Remediation Design Skill

## Purpose
Turn a verified hotspot finding into the smallest safe mitigation plan without prematurely choosing a new partition key.

## Inputs
- `hotspot-report.json`.
- Repository traces for affected operations.
- Current partition-key path, throughput mode, consistency expectations, SLAs.

## Process
1. Restate confirmed facts separately from hypotheses.
2. Rank remediations from lowest to highest blast radius: query/routing fix, duplicate-work reduction, cache/coalescing, workload spreading, data-model adjustment, throughput change, container repartition/migration.
3. For each candidate record expected RU effect, correctness risk, operational risk, rollback method, and verification metric.
4. Reject a candidate if it breaks tenant/data isolation or requires hidden dual-write semantics.
5. Prefer a reversible mitigation that addresses measured evidence.
6. If proposing partition-key change, specify new cardinality/distribution assumptions, migration/backfill strategy, dual-read/write window if applicable, consistency validation, cutover, rollback, and data reconciliation.
7. Mark container recreation, data migration, throughput changes, and production configuration changes as approval-required.
8. Define before/after measurements using the same sampling methodology.

## Expected output
A remediation decision containing selected option, alternatives rejected, evidence, approvals required, rollback, and verification plan.

## Verification
No remediation is considered verified until the post-change sample no longer breaches configured thresholds and functional tests pass.

## Failure handling
If a safe rollback cannot be defined, stop. If required production metrics cannot be obtained, mark the plan unverified rather than assuming improvement.
