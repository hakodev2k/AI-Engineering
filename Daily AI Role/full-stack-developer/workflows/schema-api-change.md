# Workflow: Schema & API Evolution
Trigger: persistence or API contract must change.
Goal: evolve contracts without breaking active consumers or availability.
Stages: inventory consumers; classify additive/behavioral/breaking change; design target and compatibility window; prefer expand-first schema/API changes; deploy readers/writers compatible with old and new forms; backfill with bounded batches and telemetry; verify adoption; remove old path only after evidence and approval.
Parallel work: consumer inventory, migration rehearsal and compatibility tests may run concurrently after target contract is agreed.
Checkpoints: compatibility proof, backfill rehearsal, consumer migration status, destructive cleanup approval.
Failure: pause on data drift, lock/latency threshold breach, unknown consumer, or rollback uncertainty.
DoD: old/new compatibility demonstrated through the transition, data verified, consumers migrated, cleanup approved and observable.