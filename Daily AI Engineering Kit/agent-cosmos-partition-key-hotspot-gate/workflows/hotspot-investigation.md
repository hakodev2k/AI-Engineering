# Cosmos Partition Hotspot Investigation Workflow

## Trigger
429/throttling spikes, unexpected RU growth, latency concentrated on specific tenants/users, or a proposed partition-key redesign.

## Entry conditions
Container and partition-key path are known; a bounded telemetry export can be obtained without changing production.

## Inputs
Repository, `partition_key,request_units` CSV, `config/policy.yaml`, relevant metrics/logs, business context.

## Stages
1. **Context — Repository Explorer**: map container configuration, key derivation, read/write entry points, retries, jobs, and tests.
2. **Measure — Performance Reviewer**: run `scripts/analyze_partition_hotspots.py`; preserve sample source/window and generated report.
3. **Diagnose — Performance Reviewer**: classify cause and separate facts from hypotheses.
4. **Plan — Performance Reviewer**: execute `skills/remediation-design.md`; choose the smallest reversible mitigation.
5. **Approval checkpoint — Human**: required before partition-key change, container recreation, bulk migration, production throughput/config change, or irreversible cutover.
6. **Execute — Implementation owner**: only after approval where required; keep change scoped to chosen mitigation.
7. **Verify — Verification Agent**: run functional tests, repeat the same hotspot measurement, inspect remaining risks and approvals.
8. **Complete** only when Definition of Done is satisfied.

## Produced artifacts
- `hotspot-report.json`
- repository evidence map
- remediation decision
- test/build evidence
- post-change report when a change was executed

## Checkpoints
- Sample sufficiency before diagnosis.
- Evidence supports each confirmed cause.
- Approval present before dangerous actions.
- Post-change functional and performance verification are both available.

## Retry rules
Transient telemetry/tool failure: retry at most 2 times, preserving prior errors. Validation, permission, business-rule, or contradictory-evidence failures are not blindly retried. Escalate after retry budget is exhausted.

## Failure paths
- Insufficient sample → `warn`, gather more evidence, no redesign claim.
- Invalid telemetry → stop with validation evidence.
- Permission failure → stop; never elevate permissions silently.
- Test/build failure → preserve output, allow at most 2 targeted fix/retest cycles, then stop.
- Approval missing → stop before dangerous action.

## Definition of Done
- Relevant repository paths and workload context are mapped.
- Sample meets policy threshold or limitation is explicitly documented.
- Hotspot status is generated deterministically.
- Confirmed causes have repository/telemetry evidence.
- Chosen remediation has rollback and verification criteria.
- Required approvals exist for dangerous actions.
- Functional tests pass for executed changes.
- Post-change sample no longer breaches target threshold, or unresolved risk is explicitly documented.
- Verification Agent status is `verified`; no blocking failure remains.
