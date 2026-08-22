# Workflow: Offline/Sync Change
Trigger: local persistence, background synchronization, mutation queue, cache, or conflict behavior changes.
Goal: change sync behavior without silent loss, duplication, or stale-state corruption.
Inputs: entity/source-of-truth contract, API idempotency, local schema, migration and compatibility needs.
Preconditions: ownership and conflict semantics explicit.
Stages:
1. Model current and target state machines.
2. Design migration/compatibility and queue semantics.
3. Review with Sync/Data Reviewer; Security Reviewer if sensitive data involved.
4. Implement deterministic transitions and bounded retries.
5. Test offline create/edit/delete, timeout-after-commit, duplicate delivery, reorder, network flap, process death, upgrade/downgrade assumptions, clock skew and terminal failure.
6. Validate telemetry for queue depth/age/conflict/failure.
7. Run review-fix-retest, maximum 2 cycles before escalation.
Human gates: irreversible data migration or conflict policy changing user-visible ownership.
Outputs: sync design, migration, tests, metrics, rollout/recovery plan.
Failure: migration ambiguity or non-idempotent critical mutation -> block release.
DoD: every persisted operation has traceable terminal or recoverable state.