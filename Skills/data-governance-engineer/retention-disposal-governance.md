# Retention and Disposal Governance

## Purpose
Govern how long data is retained and ensure defensible deletion or preservation across systems and copies.

## When to use
Use for retention schedules, storage cleanup, privacy/compliance programs, migrations, legal holds, or uncontrolled data accumulation.

## Inputs
Legal/contractual requirements, business needs, classifications, system inventory, backup design, legal-hold process, lineage.

## Context to inspect
Inspect originals, replicas, exports, backups, logs, derived datasets, archives, third parties, and deletion capabilities.

## Core knowledge
Retention should reconcile minimum retention, maximum retention, legitimate business need, and preservation holds. Disposal must address copies and downstream derivatives where applicable and be evidenced.

## Procedure
1. Inventory record/data categories and locations.
2. Map legal, contractual, and business retention requirements.
3. Resolve conflicting periods using accountable legal/risk guidance.
4. Define retention trigger events and duration.
5. Map categories to systems and downstream copies.
6. Design automated expiry/deletion where feasible.
7. Integrate legal holds and suspension of deletion.
8. Define backup and archive treatment.
9. Require third-party retention obligations.
10. Capture deletion evidence and exceptions.
11. Test representative end-to-end disposal paths.
12. Review schedules after regulatory or product changes.

## Decision points
Retain longer only with documented obligation or value; minimize data when risk outweighs value. Cryptographic erasure may be appropriate where physical deletion is impractical and controls support it.

## Common failure patterns
Retention by table age alone, indefinite backups, forgotten exports, deletion without hold checks, undocumented exceptions, and schedules not mapped to systems.

## Verification
Prove sampled records expire according to policy across primary and relevant secondary stores while active holds prevent deletion.

## Expected output
Retention schedule, system mappings, disposal controls, hold integration, evidence, and exception process.

## Stop conditions
Escalate ambiguous legal obligations, active litigation holds, or platforms unable to meet mandatory deletion requirements.