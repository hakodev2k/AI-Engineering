# Workflow: Memory Write → Recall → Verify

## Trigger
Persistent-memory integration, schema migration, poisoning incident, retrieval-policy change, or multi-user rollout.

## Goal
Ensure durable memory preserves provenance and authority, cannot cross tenant boundaries, and cannot silently promote untrusted content into policy.

## Inputs
Memory schema, write/retrieval implementation, synthetic tenants and records, promotion rules, backup/rollback mechanism.

## Baseline
Record provenance-complete percentage, cross-tenant canary retrieval count, unconfirmed policy-promotion count, and rollback success rate.

## Context
Use isolated synthetic tenants `tenant-a` and `tenant-b`; include entity-name collisions, similar embeddings, quoted instructions, tool-output injections, and confirmed policy examples.

## Stages
1. **Observe** — inspect current schema and capture baseline fixtures.
2. **Diagnose** — identify whether failures originate at write admission, metadata loss, tenant filtering, merge/retrieval, promotion, or context injection.
3. **Hypothesize** — choose the minimal enforceable control: provenance envelope, pre-search tenant filter, authority transition gate, quarantine, trust-labeled context, or lineage rollback.
4. **Implement** — change one boundary while preserving data availability and backup.
5. **Measure again** — run identical fixtures.
6. **Verify** — `subagents/memory-security-verifier.md` independently runs the suite and rollback test.
7. **Complete** — publish sanitized metrics and residual risks.

## Responsible agent
Implementation owner changes the memory layer; Memory Security Verifier performs final independent review.

## Tools
`scripts/validate_memory_record.py`, `schemas/memory-envelope.schema.json`, isolated test datastore, project-specific memory API/client.

## Outputs
Baseline report, validated memory records, test traces, before/after metrics, independent verification report.

## Checkpoints
- Before durable write: provenance envelope valid.
- Before retrieval expansion/merge: tenant scope explicit.
- Before authority promotion: authenticated source or required confirmation present.
- Before model context injection: trust label preserved.
- Before destructive cleanup/migration: backup and rollback verified.

## Metrics
Provenance completeness, cross-tenant recall count, unauthorized promotion count, quarantined unsafe writes, poisoned-memory retrieval count, rollback success.

## Retry policy
Maximum two remediation cycles; each must address a distinct evidenced failure.

## Stop conditions
Cross-user real data exposure, missing backup for destructive change, unknown tenant ownership, or repeated failure after two changed remediation cycles.

## Failure path
Quarantine affected write/retrieval path, stop policy promotion, preserve sanitized lineage evidence, revert to last verified checkpoint where possible, and escalate to security/data owner.

## Verification
Zero cross-tenant synthetic canaries; zero unconfirmed policy promotions; 100% provenance-envelope validation for accepted test writes; rollback successfully retracts poisoned descendants; unrelated valid memory remains retrievable.

## Definition of Done
Evidence/root cause documented, baseline captured, controls implemented, fixtures pass, before/after metrics recorded, rollback verified, independent PASS obtained, and no security boundary or required data context was weakened.